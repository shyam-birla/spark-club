import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

// Custom structure to define singletons
const singletonActions = new Set(["publish", "discardChanges", "restore"])
const singletonTypes = new Set(["aboutPage"])

export default defineConfig({
  name: 'default',
  title: 'SPARK Club Studio',

  projectId: 'jpsw6ns5',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // Singleton document
            S.listItem()
              .title("About Page")
              .id("aboutPage")
              .child(
                S.document()
                  .schemaType("aboutPage")
                  .documentId("aboutPage")
              ),
            
            S.divider(),

            // Regular document types
            ...S.documentTypeListItems().filter(
              (listItem) => !singletonTypes.has(listItem.getId())
            ),
          ]),
    }), 
    visionTool()
  ],

  schema: {
    types: schemaTypes,
    // Filter out singleton types from being created from the global create menu
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },

  document: {
    // Prevent editors from creating new singleton documents
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
})