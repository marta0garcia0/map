import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import destinyLogo from '../../assets/dropOffBadgeBlank.svg';
import destinyLogoError from '../../assets/dropOffBadgeError.svg';
import destinyLogoPresent from '../../assets/dropOffBadgePresent.svg';
import originLogo from '../../assets/pickUpBadgeBlank.svg';
import originLogoError from '../../assets/pickUpBadgeError.svg';
import originLogoPresent from '../../assets/pickUpBadgePresent.svg';
import Toaster from '../toaster/Toaster';
import './InputBox.scss';

const GET_GEOCODE = gql`
	query GetGeocode($value: String!) {
		geocode(address: $value) {
			address
			latitude
			longitude
		}
	}
`;
const SET_JOB = gql`
	mutation SetJob($pickup: String!, $dropoff: String!) {
		job(pickup: $pickup, dropoff: $dropoff) {
      pickup {
        address
        latitude
        longitude
      }
      dropoff {
        address
        latitude
        longitude
      }
    }
	}
`;

const InputBox = (props) => {
  const [toaster, setToaster] = useState(false);
	const [sending, setSending] = useState(false);
	const [writing, setWriting] = useState(null);

	const [origin, setOrigin] = useState({
		originValid: false,
		logoOrigin: originLogo,
		pickUpText: '', // the input value
		pickUp: '' // the query value
	});

	const [destiny, setDestiny] = useState({
		destinyValid: false,
		logoDestiny: destinyLogo,
		dropOffText: '',
		dropOff: ''
	});

	const [createJob, jobCreated] = useMutation(SET_JOB);
	useEffect(() => {
		if (jobCreated.called) {
			setToaster(false);
			if (jobCreated.loading) {
				setSending(true);
			}
			if (jobCreated.data) {
				setSending(false);
				setToaster(true);
				setOrigin({pickUpText: '', logoOrigin: originLogo, originValid: false, pickUp: ''});
				setDestiny({dropOffText: '', logoDestiny: destinyLogo, destinyValid: false, dropOff: ''});
				props.setJobCreated();
			}
			if (jobCreated.error) {
				setSending(false);
			}
		}
  // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [jobCreated.data]);

	const pickUpFetch = useQuery(GET_GEOCODE, {variables: { value: origin.pickUp }});

	useEffect(() => {
		if (pickUpFetch.error && origin.pickUp) {
			props.setPickUp(null);
			setOrigin({...origin, logoOrigin: originLogoError});
		}
		if (pickUpFetch.data && pickUpFetch.data.geocode) {
			props.setPickUp({lat: pickUpFetch.data.geocode.latitude, lng: pickUpFetch.data.geocode.longitude});
			setOrigin({...origin, logoOrigin: originLogoPresent, originValid: true});
		}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickUpFetch.error, pickUpFetch.data, origin.pickUp]);

	const dropOffFetch = useQuery(GET_GEOCODE, {variables: { value: destiny.dropOff }});

	useEffect(() => {
		if (dropOffFetch.error && destiny.dropOff) {
			props.setDropOff(null);
			setDestiny({...destiny, logoDestiny: destinyLogoError});
		}
		if (dropOffFetch.data && dropOffFetch.data.geocode) {
			props.setDropOff({lat: dropOffFetch.data.geocode.latitude,
				lng: dropOffFetch.data.geocode.longitude});
			setDestiny({...destiny, logoDestiny: destinyLogoPresent, destinyValid: true});
		}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropOffFetch.error, dropOffFetch.data, destiny.dropOff]);

	async function onInputChange(e, isPickUp) {
		if (isPickUp) {
			if (e.target.value !== origin.pickUp) {
				setOrigin({...origin, logoOrigin: originLogo, originValid: false, pickUpText: e.target.value});
			} else {
				setOrigin({...origin, logoOrigin: originLogoPresent, originValid: true, pickUpText: e.target.value});
			}
		} else {
			if (e.target.value !== destiny.dropOff) {
				setDestiny({...destiny, logoDestiny: destinyLogo, destinyValid: false, dropOffText: e.target.value});
			} else {
				setDestiny({...destiny, logoDestiny: destinyLogoPresent, destinyValid: true, dropOffText: e.target.value});
			}
		}

		clearTimeout(writing);
		setWriting(setTimeout(() => {
			if (e.target.value) {
				if (isPickUp) {
					setOrigin({...origin, pickUp: e.target.value});
				} else {
					setDestiny({...destiny, dropOff: e.target.value});
				}
			}
		}, 2000));
	}

	function onInputBlur(e, isPickUp) {
		clearTimeout(writing);
		if (isPickUp) {
			setOrigin({...origin, pickUpText: e.target.value, pickUp: e.target.value});
		} else {
			setDestiny({...destiny, dropOffText: e.target.value, dropOff: e.target.value});
		}
	}

	return (
		<>
      <Toaster state={toaster} />
			<div className='inputbox-container'>
				<div>
					<img alt='origin' src={origin.logoOrigin} />
					<input
						value={origin.pickUpText}
						type="text"
						placeholder="Pick up address"
						onChange={(e) => onInputChange(e, true)}
						onBlur={(e) => onInputBlur(e, true)}
					/>
				</div>
				<div>
					<img alt='destiny' src={destiny.logoDestiny} />
					<input
						value={destiny.dropOffText}
						type="text"
						placeholder="Drop off address"
						onChange={(e) => onInputChange(e, false)}
						onBlur={(e) => onInputBlur(e, false)}
						/>
				</div>
				<div>
  				{/* eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
					<a className={!sending && origin.originValid && destiny.destinyValid ? 'active' : ''}
						onClick={() => createJob({variables: { pickup: origin.pickUpText, dropoff: destiny.dropOffText }})}>
							{sending ? 'Creating...' : 'Create job'}</a>
				</div>
			</div>
		</>
	);
}

export default InputBox;