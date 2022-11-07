import React from 'react'
import user from '../assets/UserImage.png'
import { Link } from 'react-router-dom'

function FriendRequest({request, declineRequestHandler, acceptRequestHandler}) {
  return (
    <div className='friend-request'>
        <img src={request.sender[0].profilePic || user} alt="" />
        <div>
            <span className='friend-request-head'><Link to={`/profile/${request.sender[0]._id}`} className='friend-request-head-link'>{request.sender[0].name}</Link></span>
            <span className='interest'>{`Has an interest of ${request.sender[0].interest}`}</span>
            <div className='button-container'>
                <button className='accept-btn' onClick={() => acceptRequestHandler(request.sender[0]._id)}>Accept</button>
                <button className='decline-btn' onClick={() => declineRequestHandler(request.sender[0]._id)}>Decline</button>
            </div>
        </div>
    </div>
  )
}

export default FriendRequest