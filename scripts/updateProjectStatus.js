
async function updateProjectStatus() {
  const { writeClient } = await import('../sanity/lib/client.js');
  const projects = await writeClient.fetch(`*[_type == "project"]`);

  for (const project of projects) {
    await writeClient
      .patch(project._id)
      .set({ approvalStatus: 'published' })
      .commit();
    console.log(`Updated project ${project._id} to published`);
  }
}

updateProjectStatus().catch(console.error);
