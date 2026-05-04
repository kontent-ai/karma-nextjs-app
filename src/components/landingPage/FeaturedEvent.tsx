import { transformToPortableText } from "@kontent-ai/rich-text-resolver";
import { PortableText } from "@kontent-ai/rich-text-resolver-react";
import type { FC } from "react";
import type { Event } from "../../model/index.ts";
import { formatDate } from "../../utils/date.ts";
import { defaultPortableRichTextResolvers } from "../../utils/richtext.tsx";
import { createItemSmartLink } from "../../utils/smartlink.ts";
import type { Replace } from "../../utils/types.ts";
import Link from "../Link.tsx";
import Tags from "../Tags.tsx";
import FeaturedComponentBase from "./FeaturedComponentBase.tsx";

type FeaturedEventProps = Readonly<{
  event: Replace<Event, { elements: Partial<Event["elements"]> }>;
}>;

const FeaturedEvent: FC<FeaturedEventProps> = ({ event }) => {
  const shouldRender = Object.entries(event.elements).length > 0;

  return shouldRender ? (
    <FeaturedComponentBase
      image={{
        url: event.elements.image?.value[0]?.url ?? "",
        alt: event.elements.image?.value[0]?.description ?? "",
      }}
      type="event"
      displayFeatured={true}
    >
      <>
        <div {...createItemSmartLink(event.system.id)}>
          <h2 className="text-center lg:text-left text-5xl font-semibold text-burgundy">
            {event.elements.name?.value}
          </h2>
          <p className="text-center lg:text-left text-gray-light mt-6 text-lg">
            {`${
              event.elements.start_date?.value?.length
                ? formatDate(event.elements.start_date?.value as string)
                : ""
            }${
              event.elements.end_date?.value?.length
                ? ` - ${formatDate(event.elements.end_date?.value as string)}`
                : ""
            }`}
          </p>
          <Tags
            tags={[
              ...(event.elements.event_type?.value ?? []),
              ...(event.elements.event_topic?.value ?? []),
            ].map((t) => t.name)}
            className="mt-4"
          />
          <div className="mt-4">
            <PortableText
              value={transformToPortableText(event.elements.description?.value ?? "")}
              components={defaultPortableRichTextResolvers}
            />
          </div>
        </div>
        {event.elements.description?.value !== "<p><br></p>" && (
          <Link href={"#"} text="Read more" className="mt-6" />
        )}
      </>
    </FeaturedComponentBase>
  ) : (
    <></>
  );
};

export default FeaturedEvent;
