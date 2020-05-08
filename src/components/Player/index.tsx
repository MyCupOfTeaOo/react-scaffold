import React, { useEffect, useRef, useState, CSSProperties } from 'react';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

/* eslint-disable jsx-a11y/media-has-caption */

const i18n = {
  restart: '重播',
  rewind: '回退 {seektime}s',
  play: '播放',
  pause: '暂停',
  fastForward: '快进 {seektime}s',
  seek: '查找',
  seekLabel: '{currentTime}/{duration}',
  played: '播放中',
  buffered: '加载中',
  currentTime: '当前时间',
  duration: '总时长',
  volume: '视频大小',
  mute: '静音',
  unmute: '取消静音',
  enableCaptions: '启用字幕',
  disableCaptions: '关闭字幕',
  download: '下载',
  enterFullscreen: '全屏',
  exitFullscreen: '退出全屏',
  frameTitle: '{title}',
  captions: '字幕',
  settings: '设置',
  menuBack: '返回上一级',
  speed: '倍速',
  normal: '正常',
  quality: '清晰度',
  loop: '轮播',
  start: '开始',
  end: '结束',
  all: '全部',
  reset: '重置',
  disabled: '关闭',
  enabled: '开启',
  advertisement: '广告',
  qualityBadge: {
    2160: '4K',
    1440: '超高清',
    1080: '超清',
    720: '高清',
    576: '标清',
    480: '标清',
  },
};

interface PlayerProps {
  source?: Plyr.SourceInfo;
  className?: string;
  style?: CSSProperties;
}

export default class Player extends React.Component<PlayerProps> {
  player?: Plyr;

  renderPlayer: React.FC<PlayerProps> = props => {
    const video = useRef<HTMLVideoElement>(null);
    const [player, setPlayer] = useState<Plyr>();
    useEffect(() => {
      const thePlayer = new Plyr(video.current as HTMLElement, {
        i18n,
      });
      this.player = thePlayer;
      setPlayer(thePlayer);
    }, []);
    useEffect(() => {
      if (player) {
        player.source = props.source;
      }
    }, [props.source, player]);

    return (
      <div className={props.className} style={props.style}>
        <video ref={video} />
      </div>
    );
  };

  render() {
    return <this.renderPlayer {...this.props} />;
  }
}
