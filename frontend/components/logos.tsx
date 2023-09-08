import * as React from 'react' 

const ngos = [
  { logo: 'sea_watch_logo.png', name: 'Sea-Watch', url: 'https://sea-watch.org' },
  { logo: 'RESQSHIP.png', name: 'RESQSHIP', url: 'https://resqship.org' },
  { logo: 'mare_go_logo_2023.png', name: 'MARE*GO', url: 'https://mare-go.de' }
];

export function Logos() {
  return <>
    { ngos.map( ngo =>
	<a href={ngo.url} target='_blank'>
          <img src={'img/logos/'+ngo.logo}
	       alt={ngo.name}
               style={{ maxHeight: '150px',
	                maxWidth: '30%',
	                paddingLeft: '5%',
	                paddingRight: '5%' }}
	  />
	</a>
      )
    }
  </>
}
