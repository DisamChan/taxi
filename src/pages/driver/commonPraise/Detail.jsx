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
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Upload, Modal,
  Button, Card, Radio, InputNumber, Alert, message } from 'antd';

const TweenOneGroup = TweenOne.TweenOneGroup;
const FormItem = Form.Item;

let Detail = (props) => {
  const { dispatch, commonPraise, imgURLList,previewVisible,previewImage } = props;

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

  /* 返回分页 */
  const toPage = (e) => {
    dispatch({
      type: 'commonPraiseStore/toPage',
    });
  };

  // 预览图片
  const lookPreview = (file) => {
    dispatch({
      type: 'commonPraiseStore/lookPreview',
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };
  // 关闭预览图片
  const unlookPreview = (e) => {
    dispatch({
      type: 'commonPraiseStore/unlookPreview',
    });
  };
  //下载文件
  const download = () => {
    dispatch({
      type: 'driverCommonStore/download',
      URL: commonPraise.fileURL,
    });
  }

  return (
    <div>
      <TweenOneGroup>
        <Row key="0">
          <Col span={14}>
            <Form style={{ maxWidth: '100%', marginTop: '10px' }}>
              <Card title="普通表扬详情">
                <FormItem
                  {...formItemLayout}
                  label={(
                    <span>
                        自编号&nbsp;
                      </span>
                    )}
                >
                  {commonPraise.carNo}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={(
                    <span>
                        车牌号&nbsp;
                      </span>
                    )}
                >
                  {commonPraise.plateNumber}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={(
                    <span>
                        驾驶员姓名&nbsp;
                      </span>
                    )}
                >
                  {commonPraise.userName}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={(
                    <span>
                        从业资格证号&nbsp;
                      </span>
                    )}
                >
                  {commonPraise.qualificationNo}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={(
                    <span>
                        来电者姓名&nbsp;
                      </span>
                    )}
                >
                  {commonPraise.callName}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={(
                    <span>
                        来电者联系方式&nbsp;
                      </span>
                    )}
                >
                  {commonPraise.callMobile}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={(
                    <span>
                        来电时间&nbsp;
                      </span>
                    )}
                >
                  {commonPraise.callTime}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={(
                    <span>
                        事情发生时间&nbsp;
                      </span>
                    )}
                >
                  {commonPraise.creditTime}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={(
                    <span>
                        事情发生经过&nbsp;
                      </span>
                    )}
                >
                  {commonPraise.creditDesc}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={(
                    <span>
                        图片&nbsp;
                      </span>
                    )}
                >
                  <div>
                    <Upload
                      listType="picture-card"
                      fileList={imgURLList}
                      onPreview={lookPreview}
                    />
                    <Modal visible={previewVisible} footer={null} onCancel={unlookPreview}>
                      <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                  </div>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={(
                    <span>
                        上传文件&nbsp;
                      </span>
                    )}
                >
                  {commonPraise.fileURL ? <Button type="danger" icon="download" onClick={download} >下载</Button> : '未上传'}
                </FormItem>

                <FormItem {...tailFormItemLayout}>
                  <Button key="returnLoginButton" htmlType="button" size="large" onClick={toPage}>返回</Button>
                </FormItem>
              </Card>
            </Form>
          </Col>
        </Row>
      </TweenOneGroup>
    </div>
  );
};

function mapStateToProps({ commonPraiseStore }) {
  return {
    commonPraise: commonPraiseStore.commonPraise,
    previewVisible: commonPraiseStore.previewVisible,
    imgURLList: commonPraiseStore.imgURLList,
    previewImage: commonPraiseStore.previewImage,
  };
}


Detail = Form.create()(Detail);
export default connect(mapStateToProps)(Detail);
