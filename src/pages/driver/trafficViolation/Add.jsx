/**
 * 依赖的摆放顺序是：
 * 1. 非按需加载在最上面
 * 2. 按需加载的在下面
 * 3. 按长度从短到长
 * 4. 从对象再获取对象点出来的在按需加载下面
 * 5. 本系统业务对象在最下面，且路径不应该为相对路径，应为别名路径，别名查看 webpack.config.js
 */
import TweenOne from 'rc-tween-one';
import { connect } from 'dva';
import { Form, Input, Icon, Row, Col, Button, Card, message, Upload, Modal, DatePicker, AutoComplete, Radio } from 'antd';

const TweenOneGroup = TweenOne.TweenOneGroup;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

let Add = (props) => {
  const { dispatch, form, driver,drivers,carNos,visible } = props;
  const { getFieldDecorator } = form;

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 14,
        offset: 6,
      },
    },
  };

  /* 提交事件 */
  const handleSubmit = (e) => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'trafficViolationStore/insert',
          ...values,
          violationTime: form.getFieldValue('violationTime') != undefined ? form.getFieldValue('violationTime').format('YYYY-MM-DD HH:mm:ss') : undefined,
        });
      }
    });
  };

  /* 返回分页 */
  const toPage = (e) => {
    dispatch({
      type: 'trafficViolationStore/toPage',
    });
  };

  /** 模糊查询 车辆自编号 */
  const handleSearch = (value) => {
    dispatch({
      type: 'driverCommonStore/queryLikeCarNo',
      str: value,
    });
  };
  /** 自编号查询车信息 */
  const queryByCarNo = () => {
    dispatch({
      type: 'driverCommonStore/queryDriverListByOption',
      carNo: form.getFieldValue('carNo'),
    });
  };
  let carNo,rbs=[];
  const onCancel = () => {
    dispatch({
      type: 'driverCommonStore/onCancel',
      visible: false,
      drivers: [],
    });
  }

  if(drivers.length == 1) {
    dispatch({
      type: 'driverCommonStore/queryDriver',
      drivers: drivers,
      driver: driver,
      index: 0,
    });
    onCancel();
  } else if (drivers.length > 1) {
    drivers.forEach((value, index) => {
      rbs.push(<RadioButton key={index} value={index}>{value.userName} {value.qualificationNo}</RadioButton>);
    })
    // 弹出选择框
    dispatch({
      type: 'driverCommonStore/onCancel',
      visible: true,
      drivers: drivers,
    });
  }
  const onOk = (e) => {
    dispatch({
      type: 'driverCommonStore/queryDriver',
      drivers: drivers,
      driver: driver,
      index: e.target.value,
    });
    onCancel();
  }
  if(driver.features != undefined || driver.features != null){
    carNo = JSON.parse(driver.features).carNo;
  }

  return (
    <div>
      <Modal
        visible={visible}
        title="驾驶员人员"
        onCancel={onCancel}
        footer={null}
      >
        <RadioGroup onChange={onOk} size="large">
          {rbs}
        </RadioGroup>
      </Modal>
      <TweenOneGroup>
        <Row key="0">
          <Col span={14}>
            <Form onSubmit={handleSubmit} style={{ maxWidth: '100%', marginTop: '10px' }}>
              <Card title="新增交通违法">
                {getFieldDecorator('carId', { initialValue: driver != undefined ? driver.carId : '' })(<Input type="hidden" />)}
                {getFieldDecorator('driverId', { initialValue: driver != undefined ? driver.id : '' })(<Input type="hidden" />)}
                <FormItem
                  {...formItemLayout}
                  label={(
                    <span>
                        自编号&nbsp;
                      </span>
                    )}
                  hasFeedback
                >
                  <Col span={18}>
                    {getFieldDecorator('carNo', {
                      rules: [{ required: true, message: '请输入自编号!', whitespace: true }],
                    })(
                      <AutoComplete
                        dataSource={carNos}
                        onSearch={handleSearch}
                        placeholder="车辆自编号"
                      />
                    )}
                  </Col>
                  <Col span={4}>
                    <Button style={{ marginLeft: '30px' }}  onClick={queryByCarNo}>查询</Button>
                  </Col>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={(
                    <span>
                        车牌号&nbsp;
                      </span>
                    )}
                  hasFeedback
                >
                  {getFieldDecorator('plateNumber', {
                    initialValue: form.getFieldValue('carNo') == carNo && driver.features != undefined ? JSON.parse(driver.features).plateNumber : '',
                  })(
                    <Input disabled />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={(
                    <span>
                        从业资格证号&nbsp;
                      </span>
                    )}
                  hasFeedback
                >
                  <Col span={18}>
                    {getFieldDecorator('qualificationNo', {
                      initialValue: form.getFieldValue('carNo') == carNo && driver != undefined ? driver.qualificationNo : '',
                    })(
                      <Input disabled />
                    )}
                  </Col>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={(
                    <span>
                        驾驶员姓名&nbsp;
                      </span>
                    )}
                  hasFeedback
                >
                  {getFieldDecorator('userName', {
                    initialValue: form.getFieldValue('carNo') == carNo && driver != undefined ? driver.userName : '',
                  })(
                    <Input disabled />
                  )}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label={(
                    <span>
                        发生时间&nbsp;
                      </span>
                    )}
                  hasFeedback
                >
                  {getFieldDecorator('violationTime', {
                    rules: [{ required: true, message: '请输入发生时间!' }],
                  })(
                    <DatePicker style={{ width: 200 }} showTime format="YYYY-MM-DD HH:mm:ss" />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={(
                    <span>
                        详细地址&nbsp;
                      </span>
                    )}
                  hasFeedback
                >
                  {getFieldDecorator('violationAddress', {
                    rules: [{ required: true, whitespace: true, message: '请输入具体地址!' }],
                  })(
                    <Input />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={(
                    <span>
                        违章代码&nbsp;
                      </span>
                    )}
                  hasFeedback
                >
                  {getFieldDecorator('violationNo', {
                    rules: [{ required: true, whitespace: true, message: '请输入违章代码!' }],
                  })(
                    <Input />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={(
                    <span>
                        处理结果&nbsp;
                      </span>
                    )}
                  hasFeedback
                >
                  {getFieldDecorator('punishResult')(
                    <Input type="textarea" rows={4} />
                  )}
                </FormItem>

                <FormItem {...tailFormItemLayout}>
                  <ZButton permission="driver:violation:insert">
                    <Button key="registerButton" type="primary" htmlType="submit" size="large">保存</Button>
                  </ZButton>
                  <Button key="returnLoginButton" htmlType="button" size="large" style={{ marginLeft: '30px' }} onClick={toPage}>返回</Button>
                </FormItem>
              </Card>
            </Form>
          </Col>
        </Row>
      </TweenOneGroup>
    </div>
  );
};

function mapStateToProps({ driverCommonStore }) {
  return {
    carNos: driverCommonStore.carNos,
    driver: driverCommonStore.driver,
    drivers: driverCommonStore.drivers,
    visible: driverCommonStore.visible,
  };
}

Add = Form.create()(Add);
export default connect(mapStateToProps)(Add);
