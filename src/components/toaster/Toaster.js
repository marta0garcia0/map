import React, { useEffect, useState } from 'react';
import './Toaster.scss';

const Toaster = (props) => {
	const [state, setState] = useState(false);
  useEffect(() => {
		if (props.state) {
			setState(true);
			setTimeout(() => {
				setState(false);
			}, 5000);
		}
  }, [props.state]);
  return (
		<div className={`toaster-container ${state ? 'active' : ''}`} onClick={() => setState(false)}>
			<div>Job has been created succesfully!</div>
		</div>
	);
}

export default Toaster;