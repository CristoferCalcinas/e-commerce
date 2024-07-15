interface Props {
  params: {
    id: string;
  };
}

export default function OrderPageById({ params }: Props) {
  const { id } = params;
  return (
    <div>
      <h1>Order by {id}</h1>
    </div>
  );
}
