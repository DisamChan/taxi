import { Form } from 'antd'

import List from './List'
import Add from './Add'
import Update from './Update'

const SysRole = option => {
  const { form } = option

  return (
    <div>
      <Add />
      <Update />
      <List form={form} />
    </div>
  )
}

export default Form.create()(SysRole)
