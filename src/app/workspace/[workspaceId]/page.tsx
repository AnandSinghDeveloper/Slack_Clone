interface WorkspaceIdpageProps {
  params: {
    workspaceId: string
  }
}

const WorkspaceIdpage = ({params}: WorkspaceIdpageProps) => {
  return (
    <div>
      ID : {params.workspaceId}
    </div>
  )
}

export default WorkspaceIdpage
