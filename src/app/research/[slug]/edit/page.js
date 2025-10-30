import React from "react";
import NewResearchPage from "../../new/page";

export default function EditResearchPage({ params }) {
  const unwrappedParams = React.use(Promise.resolve(params)); // Unwrap the params Promise
  const { slug } = unwrappedParams;
  return <NewResearchPage slug={slug} />;
}
