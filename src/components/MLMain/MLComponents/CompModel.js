export default [
  {
    label: "数据相关",
    items: [
      {
        label: "数据读取",
        desc: "DataInput",
        type: "model"
      },
      {
        label: "数据拼接",
        desc: "DataCombination",
        type: "multiinput_model"
      },
      // {
      //   label: "数据分裂",
      //   desc: "DataSplit",
      //   type: "multiinput_model"
      // }
    ]
  },
  {
    label: "数据预处理",
    items: [
      {
        label: "过滤无关字段",
        desc: "UnconcernedFilter",
        type: "preprocessing"
      },
      {
        label: "缺失值填充",
        desc: "MissingValueFiller",
        type: "preprocessing"
      },
      {
        label: "One-Hot编码",
        desc: "OneHotEncoder",
        type: "preprocessing"
      },
    ]
  },
  {
    label: "模型相关",
    items: [
      {
        label: "预测结果",
        desc: "Prediction",
        type: "multiinput_predition"
      },
      {
        label: "线性模型",
        items: [
          // {
          //   label: "线性回归",
          //   desc: "LinerRegression",
          //   type: "alg"
          // },
          {
            label: "逻辑回归",
            desc: "LogisticRegression",
            type: "alg"
          },
        ]
      }, {
        label: "树模型",
        items: [
          // {
          //   label: "决策树",
          //   desc: "DecisionTree",
          //   type: "alg"
          // },
          {
            label: "随机森林",
            desc: "RandomForest",
            type: "alg"
          },
          // {
          //   label: "xgboost",
          //   desc: "RandomForest",
          //   type: "alg"
          // }
        ]
      },
      {
        label: "深度学习模型",
        items: [
          {
            label: "序贯模型",
            desc: "Sequential",
            type: "alg"
          },
        ]
      }
    ]
  }
]
