# ilearn-front


<!-- @import "[TOC]" {cmd="toc" depthFrom=2 depthTo=4 orderedList=false} -->

<!-- code_chunk_output -->

- [一、项目截图](#一-项目截图)
- [二、项目运行](#二-项目运行)
- [三、前端实现](#三-前端实现)
  - [1. 通用组件](#1-通用组件)
    - [1.1 轻量弹框](#11-轻量弹框)
    - [1.2 登录组件](#12-登录组件)
    - [1.3 导航条](#13-导航条)
    - [1.4 面包屑导航](#14-面包屑导航)
    - [1.5 分页按钮](#15-分页按钮)
  - [2. 个人中心](#2-个人中心)
    - [2.1 个人资料](#21-个人资料)
    - [2.2 我的课程](#22-我的课程)
    - [2.3 帐号](#23-帐号)
  - [3. 课程](#3-课程)
    - [3.1 课程列表](#31-课程列表)
    - [3.2 课程介绍](#32-课程介绍)
    - [3.3 课程章节](#33-课程章节)
    - [3.4 课件](#34-课件)
  - [4. 讨论](#4-讨论)
    - [4.1 讨论页面](#41-讨论页面)
    - [4.2 讨论贴](#42-讨论贴)
    - [4.3 发言](#43-发言)
  - [5. 考试](#5-考试)
  - [6. 后台页面](#6-后台页面)
    - [6.1 课程管理](#61-课程管理)
    - [6.2 考试管理](#62-考试管理)
    - [6.3 权限管理](#63-权限管理)

<!-- /code_chunk_output -->


## 一、项目截图

![course-learn.png][file:course-learn.png]

![course-list.png][file:course-list.png]

![course-chapter.png][file:course-chapter.png]

![discussion-list.jpg][file:discussion-list.jpg]

![exam.png][file:exam.png]

## 二、项目运行

- 运行环境
  - node.js / npm/ yarn

1. 初始化
```
yarn install
```

2. 运行
```
yarn serve
```

## 三、前端实现

本系统前端使用 Bootstrap 框架，它提供的布局工具和组件能使页面更加整洁统一；以及 Vue 框架，它提供的数据绑定和视图组件能方便模块化开发和整合第三方插件，加快开发速度。前端由 Vue CLI 4 构建，使用 Router 插件支持组件间的路由，Vuex 插件维护全局状态，以及 ESLint 和 Prettier 工具统一和检验代码风格。系统的前端简洁统一，布局整齐，仔细调整了组件大小比例、背景颜色、动态效果、轮廓、图标、字体和提示信息，以提高易用性，方便用户的使用，减少用户的操作。

### 1. 通用组件

#### 1.1 轻量弹框

操作后需要将操作结果告知用户，这样当网络错误或是参数有误用户会收到统一样式的提示信息。轻量弹框封装了 Bootstrap 的 Toast 组件，它不必占用页面的布局空间，也不必依赖于页面主体内容的设计，可以与它们解耦。

轻量弹框定义为 Vue 插件，挂载到 body 元素上，这样不必以 HTML 元素的形式引用，全局也只有一个实例。

#### 1.2 登录组件

有两个地方使用了登录组件。第一个是点击网站导航条右上角的登录按钮后的弹窗中，第二个是后端返回 HTTP 401 状态码后跳转到登录页面。

当用户注册成功后，会切换至登录面板，自动填充注册的邮箱，以减少用户操作。登录时输入邮箱后，当邮箱输入框失去焦点时，会判断该用户是否存在，如果存在会显示该用户的头像。当用户发起注册或是登录请求后，会禁用登录或注册按钮，直到后端返回或是超时，以避免重复提交。

用户的登录状态保存在 localStorage 中，由 Vuex 缓存，前端识别用户是否登录使用的就是这一标识，后端识别用户则使用了 token。

![login-page.png][file:login-page.png]

#### 1.3 导航条

导航条包含网站图标、课程和考试的链接、通知图标、用户头像和登录按钮。当用户未登录时，显示登录按钮，否则显示通知图标和用户头像。

通知功能会记录用户收到的回复，以及检查是否有新的回复。当用户收到回复后，会记录该回复表示哪一条评论、接收通知的用户以及属于哪一个讨论贴，并创建一条未读记录。当用户点击通知按钮时，会查询最近的通知，显示到下拉菜单中，这样用户不用离开当前页面，也不用额外设计消息页面。

回复通知的特点是它会逐渐增加而不会减少；用户大多数情况下只关心最近的通知；用户刷新网页后，需要重发请求并重新查询。如果每次都查询所有通知并返回给客户端，会增加服务器资源和网络的消耗，所以回复通知需要进行分页。相比分页按钮，滚动时自动加载消息能让用户进行更少的操作并节省了分页按钮的空间。当下拉菜单显示事件或消息列表滚动事件触发时，如果消息列表底部与下拉菜单底端的距离减少到足够小，会请求下一页通知。

当用户收到回复后，通知图标会发生变化，表示有新的未读消息。当下拉菜单隐藏时，需要取消它们的未读状态。如果下拉菜单显示时收到了新的消息，在用户刷新页面之前这条消息都不会被查询，下拉菜单隐藏时也不能取消它的未读状态。实现的方式是在通知图标加载后，会查找最近的回复，如果它是未读消息，返回它的 ID；如果已读则返回 ID 的相反数；如果还没有回复就返回 0。这样客户端就知道是否有消息和是否有未读消息。取消未读状态时，会根据 ID 删除它之前的记录，避免数据的多删。请求数据和取消未读需要有各自的互斥机制，避免重复发送。

导航条具有阴影效果，使得和网站主体间更加和谐。当鼠标悬浮在用户头像时，会显示用户信息的下拉菜单，鼠标离开 0.3 秒后会隐藏。

#### 1.4 面包屑导航

面包屑导航显示了当前页面的位置。为了复用面包屑导航的空间，在中心加了子导航和右侧加了其他导航。通过组件属性和插槽，能方便地传递导航的内容。子导航是一组 router-link 组件，可以路由到各子页面；其他导航是一个插槽，内容由父组件指定，可以是一个目录按钮。

目录按钮使用了 Bootstrap 的滚动监听功能，目录项对应页面的元素，可以跳转到页面元素，以及使当前屏幕内容所属的目录项高亮显示。当页面内容增加、页数增多时，目录就显得尤为重要。

#### 1.5 分页按钮

分页按钮是一组具有跳转功能的按钮，由以下几部分组成：

1. 上一页和下一页。可以跳转一页，分别在首页和末页时禁用。
2. 首页和末页。首页和末页是常驻的，仅当页数小于2时，只显示第一页。
3. 左跳页和右跳页。跳页对比上一页和下一页可以一次跳转更多页，当左侧或右侧不是首页或末页时显示。
4. 一组连续页。可以在连续页中跳转，应当跟随当前页的切换而自动变化。

当前页切换时，会检查目标页是否合法。当目标页不合法时，如果请求来自上一页或下一页按钮，则直接返回；否则会发布一个「currentPageChanged」事件，告诉父组件当前页已经变化。

当切换页时，应保证按钮的数量不变，避免影响页面显示效果。这一功能的实现使用的是滑动窗口，窗口大小就确定了按钮的数量。窗口的中心跟随当前页移动，如果左侧按钮较少，在当前页右边；如果右侧页较少，在当前页左边；否则与当前页相等。还需要分别判断是否需要左跳页和右跳页，如果需要则减去按钮数量。最后计算出当前窗口的起始值和终止值，将按钮渲染到页面。总页数为 10，窗口大小为 9 的分页按钮如下图所示。

![pagination.png][file:pagination.png]

### 2. 个人中心

个人中心由个人资料、我的课程和帐号三个模块组成。

#### 2.1 个人资料

个人资料是用户头像、昵称等的基本信息。头像上传使用的是 FilePond 插件，可以设置文件类型、文件大小和预览图片。生日使用了三个下拉菜单，分别表示年、月、日。用户注册后生日是空，当用户点击设置以后，才会在提交时携带生日的信息。在下拉菜单中，年和月的选项是固定的，当年和月改变时，需要检查日的正确性。会获取当前日期最后一天的值和列表中最后一天的值，如果它们不相等，就重新生成列表；如果当前生日大于日期最后一天的值，还需要设置当前生日。

![profile.png][file:profile.png]

#### 2.2 我的课程

我的课程是用户的最近学习课程节的记录。在页面创建以及换页时，会请求一页学习记录。数据渲染时，会根据课程节的总数和完成数计算学习进度。进度条使用的是 Bootstrap 的 Progress 组件，可以设置各种背景色。背景色是根据学习进度设置的，共有五种，会二分查找来选择进度在这五种阶段中满足的最大阶段。

![course-learn.png][file:course-learn.png]

#### 2.3 帐号

帐号是用户的邮箱和密码信息。一个帐号可以绑定多个邮箱，但只有主邮箱可以用于登录。解除绑定时会弹出确认框，确定才会进行解绑。修改密码时，需要输入原密码、新密码和确认密码，当两次密码输入相同，且原密码正确时，才会修改。

![account.png][file:account.png]

### 3. 课程

#### 3.1 课程列表

课程列表对课程进行了分页查询，显示课程名称和预览图。对课程卡片设置了颜色、字体、圆角边框、阴影和鼠标悬浮时上浮效果的样式。
![course-list.png][file:course-list.png]

#### 3.2 课程介绍

课程详情有介绍、章节、课件和讨论四个部分，前三个有公告和链接的侧边栏；而讨论占据整个宽度。课程介绍是点击课程列表的卡片后调转到的页面。课程介绍由课程名称、创建日期、创建者和介绍标题、介绍内容组成。介绍内容可以有列表、图片等内容，使用了 MavonEditor 插件作为 Markdown 编辑器。

![course-introduction.png][file:course-introduction.png]

#### 3.3 课程章节

课程章节是教学的视频部分，包含课程章和课程节，每一节有节标题、视频封面、视频地址和视频长度。如果用户已登录，会根据用户对课程节的未学习、开始学习和完成学习状态显示不同的背景。

![course-chapter.png][file:course-chapter.png]

本系统引入了两个视频组件。第一个是 vue-video-player，它封装了 video.js，支持 HTML 和 Flash 的播放方式，并且包含视频样式；第二个是 flv.js，它支持 flv 格式的视频。默认使用的是第一个。

![course-video.png][file:course-video.png]

当视频开始播放时，如果当前学习记录还未存在，则会更新为开始状态；当播放进度更新时，如果进度超过总时间的 90%，且状态不为已完成，则会更新为已完成状态。这两个操作在每一节都有各自的互斥锁，避免重复发送请求，同时后者的互斥锁同样作用于前者，这样在发送已完成请求时就不用发送开始请求了。

#### 3.4 课件

课件包含文件名、文件地址和课件描述。

![courseware.png][file:courseware.png]

### 4. 讨论

讨论功能包含讨论贴发布、评论发布、讨论浏览、点赞功能。

![discussion.png][file:discussion.png]

#### 4.1 讨论页面

参考各类论坛网站，讨论页面采用了瀑布的形式，每次请求一组数据，窗口滚动时，如果文档底部和浏览器底端的距离足够小，就请求一组新的讨论贴。请求具有互斥机制。

#### 4.2 讨论贴

讨论贴包含标题、评论按钮和评论面板。在评论面板创建时，会请求一组一级评论，每个一级评论又有一组二级评论，后端会查询这些评论并一起返回。一级评论和二级评论也有分页功能，避免频繁请求大量数据。

- 一级评论的分页功能

![first-level-comment.png][file:first-level-comment.png]

- 二级评论的分页功能

![second-level-comment.png][file:second-level-comment.png]

#### 4.3 发言

发言是讨论贴、一级评论和二级评论的通用部分，包含评论的用户、点赞和回复的 Markdown 编辑器。点赞和回复具有互斥锁避免重复提交。当点赞或回复操作成功后，会创建一份临时的数据并渲染到页面，而不是刷新页面，避免用户离开正在浏览的位置，回复后创建数据是通过回调函数交给评论贴组件完成的。

### 5. 考试

考试页面包含加入按钮、未完成和已完成三部分。加入考试功能使用的是考试码，考试创建后会生成唯一的考试码，当用户输入考试码后，会查找考试信息，点击「加入」后就会生成用户和考试的关联记录，并刷新页面。

加入考试时的查询功能有三种状态，分别是「请求中」、「未找到」和「已找到」，会根据状态分别显示旋转图标、未找到提示信息和考试信息。查找功能具有互斥锁避免重复提交，在查询过程中提交按钮是禁用的。

![exam.png][file:exam.png]

当获取用户已参加的考试后，会计算每个考试的开始时间和结束时间，判断它还未开始，正在进行，还是已经结束。同时会记录一个全局的最早时间，如果考试还未开始，最早时间会和开始时间进行比较；如果考试正在进行，最早时间会和结束时间进行比较。当页面创建时，会初始化一个倒计时器，每隔一秒会重新格式化考试的倒计时，如果已达到最早时间，就刷新页面。格式化时使用的是 UTC 时间，避免了时区的影响。

### 6. 后台页面

后台管理页面提供了对系统资源的管理功能，分为课程管理、考试管理和权限管理。用户登录后才能访问后台管理页面。

#### 6.1 课程管理

课程管理包含课程添加、启用和禁用功能。课程禁用后不会在前台的列表和详情页显示。

![admin-course-list-and-ban.png][file:admin-course-list-and-ban.png]

##### 概览

概览包含课程公告、预览图和参考链接。删除参考链接时，会弹出确认框，确认后才会发送删除请求。

![admin-course-overview.png][file:admin-course-overview.png]

##### 介绍

介绍可以有多条，每一条有标题和内容。

![admin-course-introduction.png][file:admin-course-introduction.png]

介绍和章节有相似的结构，都可以添加、保存、删除一项数据，可以抽取通用列表组件。列表组件会对每一条数据维护一个属性 temp，表示该数据还未提交还是已经提交。已经提交的数据可以进行删除操作，而还未提交的数据可以进行取消操作，不用发送请求。数据的增删改功能都通过事件机制交给子组件处理。当用户保存时，如果该数据还未提交，则发送添加事件；如果该数据已经提交，则发送修改事件。

使用列表组件，用户可以同时添加多个记录，同时编辑，最后再保存。这样带来的问题是假如用户添加了「第2段」和「第3段」，但是先保存了「第3段」，在保存「第2段」后就出现了顺序不一致的问题。对此的解决方法是，限制只能保存已经提交的数据，或是第一个还未提交的数据，即限制先保存「第2段」，客户端收到保存成功的消息后，「第2段」的 temp 属性会赋值为 false，之后就可以保存「第3段」了。

保存过程中是不能刷新的，这样会丢失已经编辑但还未提交的数据。所以在保存成功后，不会刷新页面，而是显示成功信息的轻量弹框。

##### 章节

每一章有标题、描述和若干节；每一节有标题、视频时长、视频地址、封面名称、封面地址。

![admin-course-chapter.png][file:admin-course-chapter.png]

页面维护了临时数据，以避免操作后刷新页面。每一节数据都维护了 temp 属性，表示这一节已经提交，还是还未提交。用户可以同时新增多个节，但只能对已经提交的，或者第一个还未提交的节进行编辑并保存，其他的编辑按钮是禁用的。

添加章后，「新增」按钮是禁用的，只有该章提交后，才能新增节。避免出现保存节时还未提交章的情况。

节的编辑包含标题、封面和视频。编辑框只创建了一个实例，而非每一节创建一个，在显示和隐藏时会设置和取消编辑框的数据，这样可以节省浏览器资源。

![admin-course-section.png][file:admin-course-section.png]

保存按钮默认是禁用的，在输入标题后，会取消禁用，编辑框的标题部分还会显示一个星号，表示已进行编辑。在上传前，会判断这一节是否还未提交，因为如果数据库还没有这一节的记录，上传文件的信息是不能保存的，所以还未提交时会阻止封面和视频文件的上传。

节的保存具有互斥锁机制，在请求发送过程中保存按钮是禁用的。保存时，会根据 temp 属性选择发送添加还是更新请求。

##### 课件

课件包含课件文件列表和课件描述。

![admin-courseware.png][file:admin-courseware.png]

#### 6.2 考试管理

考试管理提供了考试的添加功能，包含考试名称、开始时间、时长、考试链接和考试码。考试码是在添加时由后端生成的。添加操作是互斥的，同一时间只会发送一个请求。时间的格式化使用的是 UTC，避免不同时区造成的错误。

![admin-exam.png][file:admin-exam.png]

#### 6.3 权限管理

权限管理提供了对用户权限的管理功能，包含用户和用户的角色。可以对用户的角色进行修改。

![admin-auth.png][file:admin-auth.png]




[file:login-page.png]: .github/readme/login-page.png
[file:pagination.png]: .github/readme/pagination.png
[file:profile.png]: .github/readme/profile.png
[file:course-learn.png]: .github/readme/course-learn.png
[file:account.png]: .github/readme/account.png
[file:course-list.png]: .github/readme/course-list.png
[file:course-introduction.png]: .github/readme/course-introduction.png
[file:course-chapter.png]: .github/readme/course-chapter.png
[file:course-video.png]: .github/readme/course-video.png
[file:courseware.png]: .github/readme/courseware.png
[file:discussion.png]: .github/readme/discussion.png
[file:first-level-comment.png]: .github/readme/first-level-comment.png
[file:second-level-comment.png]: .github/readme/second-level-comment.png
[file:exam.png]: .github/readme/exam.png
[file:admin-course-list-and-ban.png]: .github/readme/admin-course-list-and-ban.png
[file:admin-course-overview.png]: .github/readme/admin-course-overview.png
[file:admin-course-introduction.png]: .github/readme/admin-course-introduction.png
[file:admin-course-chapter.png]: .github/readme/admin-course-chapter.png
[file:admin-course-section.png]: .github/readme/admin-course-section.png
[file:admin-courseware.png]: .github/readme/admin-courseware.png
[file:admin-exam.png]: .github/readme/admin-exam.png
[file:admin-auth.png]: .github/readme/admin-auth.png
[file:discussion-list.jpg]: .github/readme/discussion-list.jpg
