/**
 * 常用服务
 * useful server
 */
const icon_prefix = "/static/home/"

export const us = {
  data: [{
      title: "承运人管理",
      icon: icon_prefix + "carrier.png",
      description: "记录每天的工作经验和心得",
      useCount: 1000,
      page: 'carrier'
    },
    {
      title: "司机管理",
      icon: icon_prefix + "driver.png",
      description: "总结每周的工作情况和下周计划",
      useCount: 10000,
      page: 'driver'
    },
  ]
}


/**
 * other server 其他服务
 */
export const os = {
  data: [{
      title: "车辆管理",
      icon: icon_prefix + "vehicle.png",
      description: "新闻中心",
      useCount: 10000,
      page: 'vehicle'
    },
    {
      title: "挂车管理",
      icon: icon_prefix + "trailer.png",
      description: "投票中心",
      useCount: 10000,
      page: 'trailer'
    },

  ]
}