import './Tickets.css';

export const Tickets = ({ state, send }) => {
  const finish = () => {
    send({ type: 'FINISH' })
  };

  return (
    <div className='Tickets'>
      <p className='Tickets-description description'>Gracias por volar con book a fly 💚</p>
      {state.context.passengers.map((passenger, index) => (
        <div className='Tickets-ticket' key={index}>
          <div className='Tickets-country'>{state.context.selectedCountry}</div>
          <div className='Tickets-passengers'>
            {passenger}
            <span>✈</span>
          </div>
        </div>
      ))}
      <button onClick={finish} className='Tickets-finalizar button'>Finalizar</button>
    </div>
  );
}; 