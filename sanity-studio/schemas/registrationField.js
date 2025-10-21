const registrationField = {
  name: 'registrationField',
  title: 'Registration Field',
  type: 'object',
  fields: [
    {
      name: 'label',
      title: 'Field Label',
      type: 'string',
      description: 'The text displayed to the user (e.g., "Your Company", "Dietary Restrictions")',
      validation: Rule => Rule.required(),
    },
    {
      name: 'name',
      title: 'Field Name (for data storage)',
      type: 'slug',
      description: 'Unique identifier for this field in your database. Must be unique.',
      options: {
        source: 'label',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'type',
      title: 'Input Type',
      type: 'string',
      options: {
        list: [
          { title: 'Text Input', value: 'text' },
          { title: 'Email Input', value: 'email' },
          { title: 'Number Input', value: 'number' },
          { title: 'Text Area', value: 'textarea' },
          { title: 'Checkbox', value: 'checkbox' },
          { title: 'Dropdown (Single Select)', value: 'select' },
          { title: 'Multi-select Checkboxes', value: 'multiselect' },
          { title: 'File Upload', value: 'fileUpload' },
        ],
        layout: 'dropdown',
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'required',
      title: 'Is Required?',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'options',
      title: 'Options (for Dropdown/Multi-select)',
      type: 'array',
      of: [{ type: 'string' }],
      hidden: ({ parent }) => !['select', 'multiselect'].includes(parent.type),
      description: 'Enter each option on a new line.',
    },
    {
      name: 'allowedFileTypes',
      title: 'Allowed File Types (for File Upload)',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Images (jpg, png, gif, webp)', value: 'image/*' },
          { title: 'PDF', value: 'application/pdf' },
          { title: 'Documents (doc, docx, txt)', value:
'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain' },
          { title: 'Spreadsheets (xls, xlsx)', value:
'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
          { title: 'All Files', value: '*' },
        ],
      },
      hidden: ({ parent }) => parent.type !== 'fileUpload',
      description: 'Select allowed MIME types for file uploads.',
    },
    {
      name: 'placeholder',
      title: 'Placeholder Text',
      type: 'string',
      description: 'Example text shown in the input field.',
    },
  ],
};

export default registrationField;