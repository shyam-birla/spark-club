// sanity-studio/schemas/index.js
import project from './project'
import member from './member'
import event from './event'
import blogPost from './blogPost'
import blockContent from './blockContent'
import resource from './resource'
import stream from './stream'
import roadmapModule from './roadmapModule'
import aboutPage from './aboutPage' // About Page ko import karein
import contactSubmission from './contactSubmission'

export const schemaTypes = [
    project, member, event, blogPost, blockContent,
    resource, stream, roadmapModule, aboutPage, contactSubmission // Yahan add karein
]