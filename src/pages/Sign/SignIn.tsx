import React, { useCallback, useState, useEffect, useRef } from 'react';
import router from 'umi/router';
import { Input, Row, Col, Button, Alert, Modal, Spin } from 'antd';
import Icon, { UserOutlined, LockOutlined } from '@ant-design/icons';
import Redirect from 'umi/redirect';
import { useForm, useStore, Label, login } from 'teaness';
import { inject } from 'mobx-react';
import { Link } from 'umi';
import { getGuestUid, fakeAccountLogin } from '@/service/login';
import { RouteProps } from '@/typings';
import User from '@/stores/User';
import { ReactComponent as KeyBoard } from '@/assets/keyboard.svg';
import { apiPrefix } from '#/projectConfig';
import { setToken, getToken } from '../../utils/authority';
import styles from './SignIn.scss';

export interface SignInProps extends RouteProps {
  sysId: string;
  user: User;
}

interface SignForm {
  username: string;
  password: string;
  captcha: string;
}

function SignIn(props: SignInProps) {
  const [logining, setlogining] = useState(false);
  const count = useRef(30);
  const [uid, setuid] = useState<string>('');
  const [loading, setloading] = useState(false);
  const [errText, setErrText] = useState<string | undefined>(undefined);
  const store = useStore<SignForm>({
    username: {
      rules: [
        {
          required: true,
          message: '请输入用户名!',
        },
      ],
      parse(value?: React.ChangeEvent<HTMLInputElement>) {
        return value?.target.value.trim();
      },
    },
    password: {
      rules: [
        {
          required: true,
          message: '请输入密码!',
        },
      ],
      parse(value?: React.ChangeEvent<HTMLInputElement>) {
        return value?.target.value.trim();
      },
    },
    captcha: {
      rules: [
        {
          required: true,
          message: '验证码必填!',
        },
        {
          len: 4,
          message: '验证码为4位!',
        },
      ],
    },
  });
  const { Form, Item } = useForm(store);
  const onGetCaptcha = () => {
    setloading(true);
    getGuestUid()
      .then(resp => {
        setuid(resp.data);
      })
      .catch(err => {
        if (err) console.error(err);
      })
      .finally(() => {
        setloading(false);
      });
  };

  useEffect(() => {
    onGetCaptcha();
    const interval = setInterval(() => {
      if (count.current > 0) {
        count.current += 1;
      } else {
        count.current = 30;
        onGetCaptcha();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const submit = useCallback(
    e => {
      e.preventDefault();
      store.submit(({ values, errs }) => {
        if (errs) return;
        setlogining(true);

        fakeAccountLogin({
          ...(values as SignForm),
          guestUid: uid,
          sysId: props.sysId,
        })
          .then(resp => {
            if (resp.isSuccess) {
              if (resp.data.res === '1') {
                setToken(resp.data.jwt);
                props.user.loadUser();
                setlogining(false);
                router.replace('/');
              } else if (resp.data.res === '2') {
                Modal.error({
                  title: '登录异常',
                  content: '帐号存在问题,请联系管理员',
                });
              } else {
                setErrText(resp.msg);
                onGetCaptcha();
                setlogining(false);
              }
            } else {
              setErrText(resp.msg);
              onGetCaptcha();
              setlogining(false);
            }
          })
          .catch(err2 => {
            if (err2) {
              setErrText('服务器连接异常');
              onGetCaptcha();
              setlogining(false);
            }
          });
      });
    },
    [uid],
  );
  return (
    <div className={styles.layout}>
      <div>
        {getToken() ? <Redirect to="/" /> : null}
        {errText && !logining && (
          <Alert
            style={{ margin: '0 auto', maxWidth: 368 }}
            message={errText}
            type="error"
            showIcon
            closable
          />
        )}
        <div className={styles.form}>
          <Form layout={login}>
            <Item id="username">
              <Input
                placeholder="账户"
                size="large"
                prefix={<UserOutlined />}
              />
            </Item>
            <Item id="password">
              <Input
                placeholder="密码"
                type="password"
                size="large"
                prefix={<LockOutlined />}
              />
            </Item>
            <Item id="captcha">
              {params => (
                <Row gutter={8}>
                  <Col span={16}>
                    <Input
                      {...params}
                      size="large"
                      prefix={
                        <Icon
                          component={KeyBoard}
                          className={styles.keyBoard}
                        />
                      }
                    />
                  </Col>
                  <Col span={8} className={styles.captcha}>
                    <Spin spinning={loading}>
                      <Button size="large" block onClick={onGetCaptcha}>
                        {uid ? (
                          <img
                            src={
                              apiPrefix
                                ? `/${apiPrefix}/user/auth/refresh/${uid}`
                                : `/user/auth/refresh/${uid}`
                            }
                            alt="验证码"
                          />
                        ) : (
                          '验证码'
                        )}
                      </Button>
                    </Spin>
                  </Col>
                </Row>
              )}
            </Item>
            <Label>
              <Button
                loading={logining}
                size="large"
                type="primary"
                htmlType="submit"
                onClick={submit}
                block
              >
                登录
              </Button>
            </Label>
            <div className={styles.toolbar}>
              <div />
              <div>
                <a
                  style={{
                    marginRight: 12,
                  }}
                  onClick={() => {
                    router.push('/forget');
                  }}
                >
                  找回密码
                </a>
                <Link to="/signUp">注册账户</Link>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default inject(({ global, user }) => ({
  sysId: global.sysId,
  user,
}))(SignIn);
