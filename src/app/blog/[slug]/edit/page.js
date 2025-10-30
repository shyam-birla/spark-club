import React from "react";
import NewBlogPostPage from "../../new/page";

export default function EditBlogPostPage({ params }) {
  const unwrappedParams = React.use(Promise.resolve(params)); // Unwrap the params Promise
  const { slug } = unwrappedParams;
  return <NewBlogPostPage slug={slug} />;
}
