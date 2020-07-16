import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Alert } from 'antd';
import Redirect from 'umi/redirect';
import { useForm, useStore, Label, login } from 'teaness';
import { TextField, Fab, CircularProgress } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { inject } from 'mobx-react';
import { Link } from 'umi';

import { getGuestUid, fakeAccountLogin } from '@/service/login';
import { RouteProps } from '@/typings';
import User from '@/stores/User';
import { getWelcomeWindow } from '@/utils/window';
import cache from '@/utils/cache';
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
  const defaultUserName = cache.getLocalCache('username') || '';
  const store = useStore<SignForm>({
    username: {
      defaultValue: defaultUserName,
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
      defaultValue: '',
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
      defaultValue: '1234',
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
        }).then(resp => {
          if (resp.isSuccess) {
            cache.setLocalCache('username', values.username as string);
            setToken(resp.data.jwt);
            props.user.loadUser();
            getWelcomeWindow();
          } else {
            setErrText(resp.msg);
            onGetCaptcha();
            // 加点延迟效果好一点
            setTimeout(() => {
              setlogining(false);
            }, 400);
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
            className={styles.alert}
            message={errText}
            type="error"
            showIcon
            closable
          />
        )}
        <div className={styles.form}>
          <Form layout={login}>
            <Item id="username">
              <TextField
                autoFocus={!defaultUserName}
                className={styles.input}
                label="账户"
              />
            </Item>
            <Item id="password">
              <TextField
                autoFocus={!!defaultUserName}
                type="password"
                className={styles.input}
                label="密码"
              />
            </Item>
            {/* <Item id="captcha">
              {params => (
                <Row gutter={8}>
                  <Col span={16}>
                    <TextField
                      className={styles.input}
                      {...params}
                      label="验证码"
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
            </Item> */}
            <Label>
              <div className={styles.submit}>
                <div />
                <div className={styles.submitWrapper}>
                  <Fab onClick={submit} type="submit" disabled={loading}>
                    <ArrowForwardIcon />
                  </Fab>
                  {loading && (
                    <CircularProgress
                      size={68}
                      className={styles.fabProgress}
                    />
                  )}
                </div>
              </div>
            </Label>
          </Form>
          <div className={styles.toolbar}>
            <Link to="/signUp">注册</Link>
            <Link to="/forget">找回密码?</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default inject(({ global, user }) => ({
  sysId: global.sysId,
  user,
}))(SignIn);
