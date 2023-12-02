import { Card, CardHeader, Typography } from '@mui/material';
import React from 'react'

const ViewTemplateCard = () => {
  return (
    <>
    <Card>
      <CardHeader
        title={<Typography sx={
          {
            height: "1.2em", textOverflow: "ellipsis",
						overflow: "hidden", whiteSpace: "nowrap",
						maxWidth: "200px"
          }
        } variant="subtitle1">
         
        </Typography>}
      />

    </Card>
    </>
  )
}

export default ViewTemplateCard;