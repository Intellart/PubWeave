/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-prop-types */
import { useEffect, useState } from "react";

import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { map } from "lodash";
import classNames from "classnames";

type Props = {
  sections: Array<string>;
  activeSection: string;
};

function MuiTimeline(props: Props) {
  const numOfSections = props.sections.length;

  const [activeSection, setActiveSection] = useState(props.activeSection);

  useEffect(() => {
    setActiveSection(props.activeSection);
  }, [props.activeSection]);

  return (
    <Timeline position="alternate" className="timeline">
      {map(props.sections, (section, index) => (
        <TimelineItem key={index}>
          <TimelineSeparator
            className={classNames(
              "timeline-seperator",
              `timeline-seperator-${props.activeSection}`
            )}
          >
            <TimelineDot
              className={classNames(
                "timeline-dot",
                `timeline-dot-${props.activeSection}`
              )}
              variant={props.activeSection !== section ? "outlined" : "filled"}
              sx={
                {
                  // backgroundColor: (props.activeSection === 'Home') ? 'default' : '#11273F',
                }
              }
            />
            {index !== numOfSections - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent> </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}

export default MuiTimeline;
