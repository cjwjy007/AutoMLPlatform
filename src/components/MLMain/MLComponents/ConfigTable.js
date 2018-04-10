import DataPreview from './Config/Data/DataPreview.vue'
import NPZReader from './Config/Data/NPZReader.vue'
import DataCombination from './Config/Data/DataCombination.vue'
import DataSplit from './Config/Data/DataSplit.vue'

import MissingValueFiller from './Config/Preprocessing/MissingValueFiller.vue'
import OneHotEncoder from './Config/Preprocessing/OneHotEncoder.vue'
import UnconcernedFilter from './Config/Preprocessing/UnconcernedFilter.vue'

import Prediction from './Config/Alg/Prediction.vue'
import RandomForest from './Config/Alg/RandomForest.vue'
import LogisticRegression from './Config/Alg/LogisticRegression.vue'

import Sequential from './Config/Alg/Sequential.vue'

export default {
  DataPreview: DataPreview,
  DataCombination:DataCombination,
  DataSplit:DataSplit,
  MissingValueFiller: MissingValueFiller,
  OneHotEncoder: OneHotEncoder,
  UnconcernedFilter: UnconcernedFilter,
  Prediction: Prediction,
  RandomForest: RandomForest,
  LogisticRegression: LogisticRegression,
  Sequential: Sequential,
  NPZReader: NPZReader
}
