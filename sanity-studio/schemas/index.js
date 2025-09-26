import project from './project'
import member from './member'
import event from './event'
import blogPost from './blogPost'
import blockContent from './blockContent'
import resource from './resource'
import stream from './stream'
import roadmapModule from './roadmapModule'
import aboutPage from './aboutPage'
import contactSubmission from './contactSubmission'
import socialLink from './socialLink'
import technology from './technology'
import person from './person'
import registration from './registration'
import team from './team' // Step 1: Nayi team.js file ko import kiya
import memberApplication from './memberApplication';

export const schemaTypes = [
    project, member, event, blogPost, blockContent,
    resource, stream, roadmapModule, aboutPage, contactSubmission, socialLink, technology, person, registration,
    team, memberApplication // Step 2: Nayi team ko yahan list mein add kiya
]