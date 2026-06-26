interface Props{

title:string;

value:string;

}

export default function StatCard({

title,

value,

}:Props){

return(

<div className="card">

<p className="text-gray-500">

{title}

</p>

<h1 className="text-4xl font-bold mt-3">

{value}

</h1>

</div>

)

}