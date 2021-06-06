import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';
import Sign from '@/views/Sign.vue';
import CourseView from '@/views/CourseView.vue';
import ProfileView from '@/views/ProfileView.vue';
import ExamView from '@/views/ExamView.vue';
import LearnView from '@/views/LearnView.vue';
import ProfileContent from '@/components/profile/ProfileContent.vue';
import CourseContent from '@/components/profile/CourseContent.vue';
import AccountContent from '@/components/profile/AccountContent.vue';
import CourseIntroduction from '@/components/learn/CourseIntroduction.vue';
import ChapterContents from '@/components/learn/ChapterContents.vue';
import Courseware from '@/components/learn/Courseware.vue';
import Discussion from '@/components/learn/Discussion.vue';
import Admin from '@/views/Admin.vue';
import AdminHome from '@/components/admin/AdminHome.vue';
import AdminCourseList from '@/components/admin/AdminCourseList.vue';
import AdminExam from '@/components/admin/AdminExam.vue';
import AdminAuthority from '@/components/admin/AdminAuthority.vue';
import AdminCourseDetailViewport from '@/components/admin/course/AdminCourseDetailViewport.vue';
import AdminCourseOverview from '@/components/admin/course/AdminCourseOverview.vue';
import AdminCourseIntroduction from '@/components/admin/course/AdminCourseIntroduction.vue';
import AdminCourseChapter from '@/components/admin/course/AdminCourseChapter.vue';
import AdminCourseware from '@/components/admin/course/AdminCourseware.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { requireLogin: false } },
  { path: '/sign', name: 'Sign', component: Sign, meta: { requireLogin: false } },
  { path: '/course/list', name: 'CourseView', component: CourseView, meta: { requireLogin: false } },
  {
    path: '/profile',
    name: 'ProfileView',
    component: ProfileView,
    children: [
      { path: 'info', name: 'ProfileContent', component: ProfileContent, meta: { requireLogin: true } },
      { path: 'learn', name: 'CourseContent', component: CourseContent, meta: { requireLogin: true } },
      { path: 'account', name: 'AccountContent', component: AccountContent, meta: { requireLogin: true } },
    ],
    meta: { requireLogin: true },
  },
  { path: '/exam/list', name: 'ExamView', component: ExamView, meta: { requireLogin: true } },
  {
    path: '/learn',
    name: 'LearnView',
    component: LearnView,
    children: [
      { path: ':courseId', name: 'CourseIntroduction', component: CourseIntroduction, meta: { requireLogin: false } },
      { path: 'chapter/:courseId', name: 'ChapterContents', component: ChapterContents, meta: { requireLogin: false } },
      { path: 'resources/:courseId', name: 'Courseware', component: Courseware, meta: { requireLogin: false } },
      { path: 'discussion/:courseId', name: 'Discussion', component: Discussion, meta: { requireLogin: false } },
    ],
    meta: { requireLogin: false },
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    children: [
      { path: 'home', name: 'AdminHome', component: AdminHome, meta: { requireLogin: true } },
      { path: 'course', name: 'AdminCourseList', component: AdminCourseList, meta: { requireLogin: true } },
      {
        path: 'course',
        name: 'AdminCourseDetailViewport',
        component: AdminCourseDetailViewport,
        children: [
          {
            path: ':courseId',
            name: 'AdminCourseOverview',
            component: AdminCourseOverview,
            meta: { requireLogin: true },
          },
          {
            path: 'introduction/:courseId',
            name: 'AdminCourseIntroduction',
            component: AdminCourseIntroduction,
            meta: { requireLogin: true },
          },
          {
            path: 'chapter/:courseId',
            name: 'AdminCourseChapter',
            component: AdminCourseChapter,
            meta: { requireLogin: true },
          },
          {
            path: 'courseware/:courseId',
            name: 'AdminCourseware',
            component: AdminCourseware,
            meta: { requireLogin: true },
          },
        ],
        meta: { requireLogin: true },
      },
      { path: 'exam', name: 'AdminExam', component: AdminExam, meta: { requireLogin: true } },
      { path: 'auth', name: 'AdminAuthority', component: AdminAuthority, meta: { requireLogin: true } },
    ],
    meta: { requireLogin: true },
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
