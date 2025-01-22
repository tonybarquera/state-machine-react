import { useMachine } from '@xstate/react';
import { Nav } from './Nav';
import { StepsLayout } from './StepsLayout';
import bookingMachine from '../machines/bookingMachine';
import './BaseLayout.css';

const BaseLayout = () => {
  const [state, send] = useMachine(bookingMachine);
  console.log(state.context);

  return (
    <div className='BaseLayout'>
      <Nav state={state} send={send} />
      <StepsLayout state={state} send={send}/>
    </div>
  );
}

export default BaseLayout;