// import React from 'react';

// const Dashboard = () => {
//   return (
//     <div className="w-full h-screen p-4 mt-10">
      
//       <iframe
//         src="http://localhost:3000/d/cehnzoswhhjwga/flow?orgId=1&from=2025-04-01T20:01:31.754Z&to=2025-04-02T08:01:31.754Z&timezone=browser"
//         title="Grafana Dashboard"
//         width="100%"
//         height="100%"
//         frameBorder="0"
//         allowFullScreen
//       />
//     </div>
//   );
// };

// export default Dashboard;


// const Dashboard = () => {
//     return (
//       <div className="w-full h-screen">
//         <iframe
//           src="http://localhost:3000/d/cehnzoswhhjwga/flow?orgId=1&from=2025-04-01T20:01:31.754Z&to=2025-04-02T08:01:31.754Z&timezone=browser&kiosk=tv"
//           width="100%"
//           height="100%"
//           frameBorder="0"
//           title="Grafana Dashboard"
//           style={{ border: 'none' }}
//         />
//       </div>
//     );
//   };
  
//   export default Dashboard;
  
const Dashboard = () => {
    return (
      <div className="w-full h-screen">
        <iframe
          src="http://localhost:3000/d/cehnzoswhhjwga/flow?orgId=1&from=now-6h&to=now&timezone=browser&kiosk=tv"
          width="100%"
          height="100%"
          frameBorder="0"
          title="Grafana Dashboard"
          style={{ border: 'none' }}
        />
      </div>
    );
  };
  
  export default Dashboard;
  