import React from 'react';
import * as S from './References.styles';
import { FacebookOutlined, GithubOutlined, LinkedinOutlined, TwitterOutlined } from '@ant-design/icons';

const GithubIcon = S.withStyles(GithubOutlined);
const TwitterIcon = S.withStyles(TwitterOutlined);
const FacebookIcon = S.withStyles(FacebookOutlined);
const LinkedinIcon = S.withStyles(LinkedinOutlined);

export const References: React.FC = () => {
  return (
    <S.ReferencesWrapper>
      <S.Text>&copy;. 2022</S.Text>
      <S.Icons>
        <a target="_blank" rel="noreferrer">
          <GithubIcon />
        </a>
        <a target="_blank" rel="noreferrer">
          <TwitterIcon />
        </a>
        <a target="_blank" rel="noreferrer">
          <FacebookIcon />
        </a>
        <a target="_blank" rel="noreferrer">
          <LinkedinIcon />
        </a>
      </S.Icons>
    </S.ReferencesWrapper>
  );
};
