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
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Switch,
    Button, Card, Radio, InputNumber, DatePicker, Alert, message, Upload, Modal } from 'antd';
import moment from 'moment';

const TweenOneGroup = TweenOne.TweenOneGroup;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
const Option = Select.Option;

let InsuranceUpdate = (props) => {
  const { dispatch, form, insurance } = props;
  const { getFieldDecorator } = form;
  const { plateList, previewVisible, previewImage, insuranceFile, insuranceList } = props;

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
  const updateInsurance = (e) => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const insuranceBuyDate = form.getFieldValue('insuranceBuyDate') ? form.getFieldValue('insuranceBuyDate').format('YYYY-MM-DD') : null;
        const insuranceExpireDate = form.getFieldValue('insuranceExpireDate') ? form.getFieldValue('insuranceExpireDate').format('YYYY-MM-DD') : null;
        dispatch({
          type: 'insuranceStore/updateNotNull',
          ...values,
          insuranceBuyDate,
          insuranceExpireDate,
          insuranceFile,
        });
      }
    });
  };

  /* 返回分页 */
  const toPage = (e) => {
    dispatch({
      type: 'insuranceStore/queryPage',
    });
  };

  // 上传图片
  const insuranceChange = ({ fileList }) => {
    dispatch({
      type: 'insuranceStore/insuranceChange',
      insuranceList: fileList,
    });
  };
  // 预览图片
  const handlePreview = (file) => {
    dispatch({
      type: 'insuranceStore/lookPreview',
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };
  // 删除图片
  const handleCancel = (e) => {
    dispatch({
      type: 'insuranceStore/unlookPreview',
    });
  };
  // 添加图片样式
  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">点击上传文件</div>
    </div>
  );

  return (
    <div>
      <TweenOneGroup>
        <Row key="0">
          <Col span={16}>
            <Form onSubmit={updateInsurance} style={{ maxWidth: '100%', marginTop: '10px' }}>
              <Card title="修改车辆保险">
                <FormItem>
                  {getFieldDecorator('id', { initialValue: insurance.id,
                  })(
                    <Input type="hidden" />
                    )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('carId', { initialValue: insurance.carId,
                  })(
                    <Input type="hidden" />
                    )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={(
                    <span>
                        自编号&nbsp;
                      </span>
                    )}
                  hasFeedback
                >
                  {getFieldDecorator('carNo', {
                    rules: [{ required: true, message: '请输入自编号!', whitespace: true }], initialValue: insurance.carNo,
                  })(
                    <Input disabled />
                    )}
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
                    rules: [{ required: true, message: '请输入车牌号!' }], initialValue: insurance.plateNumber,
                  })(
                    <Input disabled />
                    )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={(
                    <span>
                        车辆照片&nbsp;
                      </span>
                    )}
                >
                  {getFieldDecorator('plateImage')(
                    <div >
                      <Upload
                          action=""
                          listType="picture-card"
                          fileList={plateList}
                          onPreview={handlePreview}
                        />
                      <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
                          <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                    </div>
                    )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={(
                    <span>
                        保险类型 &nbsp;
                      </span>
                    )}
                  hasFeedback
                >
                  {getFieldDecorator('insuranceType', {
                    rules: [{ required: true, message: '请选择保险类型!' }], initialValue: insurance.insuranceType,
                  })(<Select disabled style={{ width: 160 }}>
                    <Option value="TRAFFIC">交通强制险</Option>
                    <Option value="BUSINESS">商业保险</Option>
                  </Select>)}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={(
                    <span>
                        保险公司 &nbsp;
                      </span>
                    )}
                  hasFeedback
                >
                  {getFieldDecorator('insuranceCompany', {
                    rules: [{ required: true, message: '请输入保险公司!', whitespace: true },{ max: 64, message: '保险公司最多长度64', whitespace: true }], initialValue: insurance.insuranceCompany,
                  })(
                    <Input />
                    )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={(
                    <span>
                        保险名称 &nbsp;
                      </span>
                    )}
                  hasFeedback
                >
                  {getFieldDecorator('insuranceName', {
                    initialValue: insurance.insuranceName,
                  })(
                    <Input />
                    )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={(
                    <span>
                        保险金额 &nbsp;
                      </span>
                    )}
                  hasFeedback
                >
                  {getFieldDecorator('insuranceMoney', {
                    initialValue: insurance.insuranceMoney,
                  })(
                    <InputNumber min={0} max={1000000} />
                    )}
                  (元)
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={(
                    <span>
                        保险单号 &nbsp;
                      </span>
                    )}
                  hasFeedback
                >
                  {getFieldDecorator('policyNo', {
                    rules: [{ required: true, message: '请输入保险单号!', whitespace: true },{ max: 64, message: '保险单号最多长度64', whitespace: true }], initialValue: insurance.policyNo,
                  })(
                    <Input />
                    )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={(
                    <span>
                        保险有效扫描件&nbsp;
                      </span>
                    )}
                >
                  {getFieldDecorator('insuranceFile')(
                    <div >
                      <Upload
                          action="/fileupload/image.htm"
                          listType="picture-card"
                          fileList={insuranceList}
                          onPreview={handlePreview}
                          onChange={insuranceChange}
                        >
                          { insuranceList.length >= 1 ? null : uploadButton}
                        </Upload>
                      <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
                          <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                    </div>
                    )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={(
                    <span>
                        保险生效时间 &nbsp;
                      </span>
                    )}
                >
                  {getFieldDecorator('insuranceBuyDate', {
                    rules: [{ required: true, message: '请选择保险生效时间!' }], initialValue: moment(insurance.insuranceBuyDate),
                  })(<DatePicker />)}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={(
                    <span>
                         保险到期时间&nbsp;
                      </span>
                    )}
                >
                  {getFieldDecorator('insuranceExpireDate', {
                    rules: [{ required: true, message: '请选择保险到期时间!' }], initialValue: moment(insurance.insuranceExpireDate),
                  })(<DatePicker />)}
                </FormItem>

                <FormItem {...tailFormItemLayout}>
                  <Button key="registerButton" type="primary" htmlType="submit" size="large">保存编辑</Button>
                  <Button key="returnLoginButton" htmlType="button" size="large" style={{ marginLeft: '30px' }} onClick={toPage}>返回</Button>
                </FormItem>
              </Card>
            </Form>
          </Col>
          <Col span={12} />
        </Row>
      </TweenOneGroup>
    </div>
  );
};

function mapStateToProps({ insuranceStore }) {
  return {
    insurance: insuranceStore.insurance,

    previewVisible: insuranceStore.previewVisible,
    previewImage: insuranceStore.previewImage,
    plateList: insuranceStore.plateList,
    insuranceFile: insuranceStore.insuranceFile,
    insuranceList: insuranceStore.insuranceList,
  };
}
InsuranceUpdate = Form.create()(InsuranceUpdate);
export default connect(mapStateToProps)(InsuranceUpdate);
