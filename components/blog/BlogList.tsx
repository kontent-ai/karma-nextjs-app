import type { PortableTextObject } from "@kontent-ai/rich-text-resolver";
import { type FC, Fragment } from "react";
import { Divider } from "../Divider.tsx";
import { PageSection } from "../PageSection.tsx";
import { BlogListItem } from "./BlogListItem.tsx";

type Blog = Readonly<{
  id: string;
  imageSrc?: string;
  title: string;
  description: PortableTextObject[];
  readMoreLink: string;
}>;

type BlogListProps = Readonly<{
  blogs: ReadonlyArray<Blog>;
}>;

export const BlogList: FC<BlogListProps> = ({ blogs }) => (
  <div className="flex flex-col">
    {blogs.map((blog) => (
      <Fragment key={blog.id}>
        <PageSection color="bg-white">
          <div className="max-w-6xl mx-auto">
            <BlogListItem
              imageSrc={blog.imageSrc}
              title={blog.title}
              description={blog.description}
              readMoreLink={blog.readMoreLink}
              className="pt-[98px] pb-[150px]"
            />
          </div>
        </PageSection>
        <Divider />
      </Fragment>
    ))}
  </div>
);
