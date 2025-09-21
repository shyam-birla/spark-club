/**
* This configuration file lets you run `$ sanity [command]` in this folder
* Go to https://www.sanity.io/docs/cli to learn more.
**/
import { defineCliConfig } from 'sanity/cli'

// YAHAN BADLAV KIYA GAYA HAI:
// Project ID aur Dataset ko seedha hardcode karein.
const projectId = "jpsw6ns5"
const dataset = "production"

export default defineCliConfig({ api: { projectId, dataset } })