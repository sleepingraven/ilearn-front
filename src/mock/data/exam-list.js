const data = {
  exams: [
    {
      status: { text: '测试', class: '' },
      title: '计算机操作系统',
      startTime: new Date().setMinutes(new Date().getMinutes() - 80) - 50_000,
      totalTime: 90,
      alias: 'Operating System',
    },
    {
      status: { text: '测试', class: '' },
      title: '计算机网络',
      startTime: new Date().setDate(new Date().getDate() + 1) + 5_000,
      totalTime: 90,
      alias: 'Computer Networks',
    },
    {
      status: { text: '测试', class: '' },
      title: '计算机组成原理',
      startTime: new Date().setDate(new Date().getDate() - 1),
      totalTime: 90,
      alias: 'Computer Organization',
    },
  ],
};

module.exports = data;
