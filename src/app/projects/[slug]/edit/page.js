import React from "react";
import NewProjectPage from "../../new/page";

export default function EditProjectPage({ params }) {
  const unwrappedParams = React.use(Promise.resolve(params)); // Unwrap the params Promise
  const { slug } = unwrappedParams;
  return <NewProjectPage slug={slug} />;
}
