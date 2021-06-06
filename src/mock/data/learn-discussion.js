const data = {
  posts: [
    {
      title: '跨域问题解决方案，有问题的童鞋看过来',
      name: 'qq_慕妹3487484',
      timestamp: '2020-12-05',
      replyNum: 8,
      content:
        'google配置后仍然无法正确获取otpcode。由于谷歌浏览器的SameSite安全机制的问题，浏览器在跨域的时候不允许request请求携带cookie，导致每次sessionId都是新的，这里有个出问题前提：跨域，刚好和调试时的环境情况一致。浏览器版本chrome84.0.4147.135（谷歌游览器好像从80版本之后就加入了SameSite安全机制）,直接在地址栏里输入chrome://flags/，然后在搜索框里搜索关键字SameSite,找到与之匹配的项SameSite by default cookies，将其设置为Disabled,然后关闭浏览器再打开，请求。',
      comments: [
        {
          name: 'weixin_玥含_0',
          timestamp: '2020-12-07',
          content: '👍这个方法好用',
        },
        {
          name: 'weixin_慕粉4330580',
          timestamp: '2020-12-17',
          content:
            '折腾了一天,用你的方法解决了,虽然感觉这个方法不是很好(通过设置本机浏览器配置),但这个项目本身就是入门练手的,先能跑通就行.感谢',
        },
        {
          name: 'qq_慕仙2069110',
          timestamp: '2020-12-17',
          content:
            '我的只要加了\n' +
            '\n' +
            '@CrossOrigin(allowCredentials = "true",allowedHeaders = "*")\n' +
            'springboot都跑不起来',
        },
      ],
    },
    {
      title: '后端仍然无法获取到验证码',
      name: '慕妹3325488',
      timestamp: '2020-08-31',
      replyNum: 4,
      content:
        '在获取验证码阶段，debug能够获取到验证码； 但是注册的时候，依然为null。  按照老师的方法添加了注解\n' +
        '@CrossOrigin(allowCredentials = "true",allowedHeaders = "*")\n' +
        '前端也添加了\n' +
        '\n' +
        'xhrFields: {withCredentials: true},\n' +
        '\n' +
        '而且标点符号也没问题',
      comments: [
        {
          name: 'weixin_慕无忌0203269',
          timestamp: '2020-11-18',
          content: '按老师那种方法在前端、后端加了跨域请求，但是没用。  请问解决了吗？有解决方法吗？',
          comments: [
            {
              name: 'weixin_精慕门4430740',
              timestamp: '2020-11-19',
              content:
                '后端可以尝试将代码改为： String inSessionOtpCode = this.httpServletRequest.getParameter("otpCode");',
            },
            {
              name: 'java小小菜菜',
              timestamp: '2021-01-31',
              content: '亲测有效，感谢',
              replyTo: 'weixin_精慕门4430740',
            },
            {
              name: 'MHLEVEL',
              timestamp: '2021-03-28',
              content: '亲测有效，谢谢！',
              replyTo: 'weixin_精慕门4430740',
            },
          ],
        },
      ],
    },
    {
      title: '由于枚举的值是单例的，在BussinessException中直接传入枚举实例并修改，可能会有并发问题吧？',
      name: 'webcat',
      timestamp: '2019-03-28',
      replyNum: 7,
      content:
        '由于枚举的值是单例的，如果在一个BussinessException传入枚举，再执行setErrMsg修改错误信息。那么在不同线程里所有引用这个枚举的BussinessException中的ErrMsg都会改变。',
      comments: [
        {
          name: '慕圣8322165',
          timestamp: '2019-06-27',
          content:
            '反编译枚举类就知道，枚举类的成员变量都是用static final来修饰的，这样修改绝对存在线程安全问题，建议msg不要在这里修改',
          comments: [
            {
              name: '少年啊c',
              timestamp: '2019-08-01',
              content: '这个改的是局部变量',
            },
          ],
        },
        {
          name: 'weixin_慕丝9246528',
          timestamp: '2020-08-29',
          content: `\`\`\` java
java
@RestController
@RequestMapping("/user")
public class UserController {
     
    @GetMapping("/get")
    public String get() {
        return EmBusinessError.PARAMETER_VALIDATION_ERROR.setErrMsg("用户id错误")
                    .getErrMsg();
    }
 
    @GetMapping("/getDefaultMsg")
    public String getDefaultMsg() {
        return EmBusinessError.PARAMETER_VALIDATION_ERROR.getErrMsg();
    }
}
\`\`\`

setErrMsg这个方法是有问题的。

假设第一次调用方法get，返回”用户id错误“消息，第二次调用getDefaultMsg方法期望返回“参数错误”这条消息，由于枚举类是单例的，所以在get修改EmBusinessError.PARAMETER_VALIDATION_ERROR的属性后，getDefaultMsg方法还是返回”用户id错误“消息。`,
        },
        {
          name: 'sunbohan00',
          timestamp: '2019-03-28',
          content:
            '枚举是实现单例模式的一种方式，但不代表枚举就是单例模式。由于枚举和单例很像，都是将构造方法私有化，且不用考虑序列化的问题。\n' +
            '\n' +
            '多线程并发问题，把Singleton声明成volatile，',
        },
        {
          name: 'webcat',
          timestamp: '2019-03-28',
          content:
            '抱歉，我说错了。枚举不是单例，枚举里面可以定义多个值，每个值都是一个实例，但是这些枚举值是单例的。用枚举实现单例模式也是利用它的值只实例化一次这个特性。\n' +
            '\n' +
            '在这个视频教程中，创建了一个枚举，枚举定义了多个值，又定义了两个枚举属性code，errMsg。\n' +
            '\n' +
            '教程中，在使用某个枚举值的时候，修改了枚举的属性errMsg。这样是不是有线程安全问题？',
          comments: [
            {
              name: 'sunbohan00',
              timestamp: '2019-03-28',
              content:
                '我这是才想起来有个问题忘了和你说，你发的这些东西是回复你自己，回复的不是我，如果不是我突然想起一个问题，我永远都不会看到你的这段话。 第二点：课程是5-2里面有的，你为什么提问在3-3。 第三点：我刚看到5-2里面，调用BussinessException的ErrMsg，根本不会存在你说的问题，首先多个code提示词，是在不同判断下条件下的，其次，每一个订单都会重新调用这个方法，不会遗留code重复的问题。',
            },
            {
              name: 'webcat',
              timestamp: '2019-03-28',
              content:
                '谢谢你的回复。每个订单都会重新调用这个方法，这个没问题，问题在于并发。如果分别有两个用户同时去修改同一个code对应的errMsg，即他们同时去修改同一个枚举值的errMsg，这样就会出现后者把前者的errMsg覆盖。',
              replyTo: 'sunbohan00',
            },
          ],
        },
        {
          name: '未完待续4',
          timestamp: '2019-03-28',
          content: '你怎么修改枚举中的属性？反射？你要用反射那有什么会是安全的？',
          comments: [
            {
              name: 'webcat',
              timestamp: '2019-03-28',
              content:
                '枚举可以有自定义属性。修改自定义属性和普通的类一样的。比如本节视频教程中定义的枚举EmBussinesError',
            },
          ],
        },
        {
          name: '少年啊c',
          timestamp: '2019-08-01',
          content: '这里改的是局部变量吧，没有并发问题',
        },
        {
          name: '宝慕林9319546',
          timestamp: '2020-07-20',
          content: '有的吧 通过枚举创建的通用错误类型是单列的啊  并发下都调用setErrmsg就有并发问题 没毛病的',
        },
      ],
    },
  ],
};

module.exports = data;
