interface Props {
  params: Promise<{ projectId: string }>;
}

const page = async ({ params }: Props) => {
  const { projectId } = await params;
  return <div></div>;
};

export default page;
