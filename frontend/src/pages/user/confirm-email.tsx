import { gql } from 'apollo-server-express';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useMe } from '../../hooks/useMe';
import { useHistory } from 'react-router-dom';
import { useMutation } from 'react-query';

const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

export const ConfirmEmail = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  const history = useHistory();

  const onCompleted = (data: verifyEmail) => {
    const {
      verifyEmail: { ok },
    } = data;

    if (ok && userData?.me.id) {
      client.writeFragment({
        id: `User:${userData?.me.id}`,
        fragment: gql`
          fragment VerifiedUser on User {
            verified
          }
        `,
        data: {
          verified: true,
        },
      });
      history.push('/');
    }
  };

  const [verifyEmail] = useMutation<verifyEmail, verifyEmailVariables>(
    VERIFY_EMAIL_MUTATION,
    {
      onCompleted,
    },
  );

  const location = useLocation();

  useEffect(() => {
    const [_, code] = window.location.href.split('=code');
    verifyEmail({
      variables: {
        input: {
          code,
        },
      },
    });
  }, []);

  return (
    <div>
      <h2>이메일 인증 중...</h2>
      <h4>잠시만 기다려주세요...</h4>
    </div>
  );
};
