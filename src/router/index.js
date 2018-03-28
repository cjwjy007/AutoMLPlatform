import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import Welcome from '@/components/Welcome'
import Project from '@/components/Projects/Project'
import ProjectsController from '@/components/Projects/ProjectsController'
import DataUploader from '@/components/DataSet/DataUploader'
import Data from '@/components/DataSet/Data'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main,
      children: [
        {
          name: 'welcome',
          path: '',
          component: Welcome
        },
        {
          name: 'projectscontroller',
          path: 'projectscontroller',
          component: ProjectsController
        },
        {
          name: 'project',
          path: 'project/:id',
          component: Project
        },
        {
          name: 'uploaddata',
          path: 'uploaddata',
          component: DataUploader
        },
        {
          name: 'data',
          path: 'data',
          component: Data
        }
      ]
    }
  ]
})
