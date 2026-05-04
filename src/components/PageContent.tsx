import { transformToPortableText } from "@kontent-ai/rich-text-resolver";
import {
  PortableText,
  type PortableTextReactResolvers,
} from "@kontent-ai/rich-text-resolver-react";
import { type FC, useMemo } from "react";
import { isDisclaimer, isVideo, type LandingPage } from "../model/index.ts";
import { defaultPortableRichTextResolvers } from "../utils/richtext.tsx";
import { createElementSmartLink, createItemSmartLink } from "../utils/smartlink.ts";
import CallToAction from "./CallToAction.tsx";
import InformationalDisclaimer from "./disclaimer/InformationalDisclaimer.tsx";
import PromotionalDisclaimer from "./disclaimer/PromotionalDisclaimer.tsx";
import Video from "./Video.tsx";

type PageContentProps = {
  body: LandingPage["elements"]["body_copy"];
  itemId: string;
};

const PageContent: FC<PageContentProps> = ({ body, itemId }) => {
  const portableText = useMemo(() => transformToPortableText(body.value), [body.value]);
  const portableTextComponents = useMemo(
    () => createPortableTextComponents(body, itemId),
    [body, itemId],
  );

  return (
    <div
      className="pt-[104px] pb-40 flex flex-col gap-40"
      {...createItemSmartLink(itemId)}
      {...createElementSmartLink("body_copy")}
    >
      <PortableText value={portableText} components={portableTextComponents} />
    </div>
  );
};

const createPortableTextComponents = (
  element: PageContentProps["body"],
  parentId: PageContentProps["itemId"],
): PortableTextReactResolvers => ({
  ...defaultPortableRichTextResolvers,
  types: {
    componentOrItem: ({ value }) => {
      const item = element.linkedItems.find(
        (item) => item.system.codename === value.componentOrItem._ref,
      );
      if (!item) {
        return <div>Did not find any item with codename {value.componentOrItem._ref}</div>;
      }

      if (isVideo(item)) {
        return <Video video={item} parentId={parentId} componentId={item.system.id} />;
      }

      if (isDisclaimer(item)) {
        return item.elements.type.value[0]?.codename === "promotional" ? (
          <PromotionalDisclaimer
            title={item.elements.headline.value}
            text={item.elements.subheadline.value}
            parentId={parentId}
            componentId={item.system.id}
          />
        ) : (
          <InformationalDisclaimer
            title={item.elements.headline.value}
            text={item.elements.subheadline.value}
            parentId={parentId}
            componentId={item.system.id}
          />
        );
      }

      return (
        <CallToAction
          title={item.elements.headline.value}
          description={item.elements.subheadline.value}
          buttonText={item.elements.button_label.value}
          buttonHref={item.elements.button_link.linkedItems[0]?.elements.url.value ?? ""}
          imageSrc={item.elements.image.value[0]?.url}
          imageAlt={item.elements.image.value[0]?.description ?? "alt"}
          imagePosition={item.elements.image_position.value[0]?.codename ?? "left"}
          parentId={parentId}
          componentId={item.system.id}
        />
      );
    },
  },
});

export default PageContent;
