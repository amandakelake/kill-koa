import { Context } from 'koa';
import { getManager } from 'typeorm';
import { Project } from '../entity/project';

export default class ProjectController {
    public static async getProjectList(ctx: Context) {
        const projectRepository = getManager().getRepository(Project);
        const projects = await projectRepository.find();

        ctx.status = 200;
        ctx.body = projects;
    }

    public static async addProject(ctx: Context) {
        const projectRepository = getManager().getRepository(Project);
        const project = new Project();
        const { name, personId, organization } = ctx.request.body as Record<string, any>;
        project.name = name;
        project.personId = personId;
        project.organization = organization;

        const saveProject = await projectRepository.save(project);

        ctx.status = 201;
        ctx.body = saveProject;
    }
}
