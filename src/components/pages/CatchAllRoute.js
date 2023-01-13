// @flow
import React, { useEffect } from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import { useNavigate } from 'react-router-dom';

type Props = {
  isAuthorized: boolean,
  isAdmin: boolean,
};

function CatchAllRoutes(props: Props): Node {
  const navigate = useNavigate();

  useEffect(() => {
    if (props.isAuthorized) {
      navigate('/', { replace: true });
    }

    if (props.isAdmin) {
      navigate('/', { replace: true });
    }
  }, [props.isAuthorized, props.isAdmin, navigate]);

  return (
    <main className="blogs-wrapper">asd
    </main>
  );
}

export default CatchAllRoutes;
