import * as React from 'react';
import PROVIDERS from '../providers.json';

const providersWithoutCoordinates = PROVIDERS.filter(obj => !obj.hasOwnProperty('coordinates'));

console.log('providersWithoutCoordinates: ', providersWithoutCoordinates);

function Panel() {
  return (
    <div className="control-panel" >
      <h3>Providers that does not show up on the map is listed here. </h3>
      { providersWithoutCoordinates.map((provider) => {
        return (
          <div className="panel-element">
              <b>
                Provider Name:
              </b>
              <div>
                {`${provider.firstName}, ${provider.lastName}`}
              </div>
              <b>
                Language:
              </b>
              <div>
                {provider.language.join(' ')}
              </div>
              <b>
                Phone Number
              </b>
              <div>
                {provider.phoneNumber}
              </div>
              <b>
                Address:
              </b>
              <div>
                {provider.address}
              </div>
              <b>
                Bussiness Hour:
              </b>
              { provider.businessHour.map((timestap) => {
                return (
                  <div>
                    {`${timestap.day}: ${timestap.hours}`}
                  </div>
                )
              })}
            </div>
            
        )
      })}
    </div>
  );
}

export default React.memo(Panel);
