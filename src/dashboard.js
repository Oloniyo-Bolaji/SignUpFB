import React from 'react';





const Dashboard = ({user,  logOut, isGoogleUser}) => {
return(

<div>
    {isGoogleUser ? 
    (
<div className="m-5" >
    <h5 className="card-title m-2 text-capitalize">Hello, {user.displayName} </h5>
    <button className="btn btn-warning" onClick={logOut}>Logout</button>
</div>
    )
:
(
<div className="m-5" >
    <h5 className="card-title m-2">Hello, {user.email} </h5>
    <button className="btn btn-warning" onClick={logOut}>Logout</button>
</div>
)}
</div>

)
}

export default Dashboard