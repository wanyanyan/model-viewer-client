<template>
  <Form class="my-form" :model="option" :label-width="70">
    <FormItem label="类型">
      <Select v-model="option.type" size="small" @on-change="typeChange">
        <Option v-for="item in lightTypes" :value="item.type" :key="item.type">{{ item.name }}</Option>
      </Select>
    </FormItem>
    <FormItem label="颜色" v-if="option.color">
      <ColorPicker v-model="option.color" size="small" format="hex" transfer/>
    </FormItem>
    <FormItem label="强度">
      <Slider v-model="option.intensity" :min="0" :max="3" :step="0.1"></Slider>
    </FormItem>
    <FormItem label="光源位置" v-if="option.position">
      x: <InputNumber v-model="option.position[0]" size="small" style="width: 60px;"></InputNumber>
      y: <InputNumber v-model="option.position[1]" size="small" style="width: 60px;"></InputNumber>
      z: <InputNumber v-model="option.position[2]" size="small" style="width: 60px;"></InputNumber>
    </FormItem>
    <FormItem label="照射目标" v-if="option.target">
      x: <InputNumber v-model="option.target[0]" size="small" style="width: 60px;"></InputNumber>
      y: <InputNumber v-model="option.target[1]" size="small" style="width: 60px;"></InputNumber>
      z: <InputNumber v-model="option.target[2]" size="small" style="width: 60px;"></InputNumber>
    </FormItem>
    <FormItem label="照射距离" v-if="option.distance">
      <InputNumber :min="1" v-model="option.distance" size="small" style="width: 100px;"></InputNumber>
    </FormItem>
  </Form>
</template>

<script>
import Constants from '@/libs/constants'
import shortid from 'shortid'
export default {
  methods: {
    typeChange() {
      let type = this.option.type
      this.option = Object.assign({
        id: shortid.generate(),
        type: type
      }, Constants.lights[type])
    }
  },
  mounted() {
    this.option = Object.assign({
      id: shortid.generate(),
      type: 'direction'
    }, Constants.lights.direction)
  },
  data() {
    return {
      option: {},
      lightTypes: [
        {
          type: 'direction',
          name: '平行光'
        },
        {
          type: 'point',
          name: '点光源'
        },
        {
          type: 'spot',
          name: '聚光灯'
        }
      ]
    }
  }
}
</script>