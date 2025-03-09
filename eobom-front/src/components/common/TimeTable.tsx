import * as React from "react";
import { useEffect, useState } from "react";


type TimeTableProps = {
  setWeeklyHours: React.Dispatch<React.SetStateAction<number>>,
  setSchedule: React.Dispatch<React.SetStateAction<Map<string, { startTime: string; endTime: string }>>>,
}

type Schedule = {
  [key: string]: { startTime: string, endTime: string };
}

const TimeTable = ({ setWeeklyHours, setSchedule }: TimeTableProps) => {
  const [selected, setSelected] = useState<boolean[][]>(Array.from(Array(12), () => Array(7).fill(false)));
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [currentDiv, setCurrentDiv] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMouseUp = () => setMouseDown(false);
    const handleMouseDown = () => setMouseDown(true);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  useEffect(() => {
    const schedule = new Map();

    const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    for (let j = 0; j < 7; j++) {
      let times: number[][] = [];
      let current = 9;
      for (let i = 0; i < 12; i++) {
        if (selected[i][j]) {
          if (times.length > 0 && times[times.length - 1][1] == current) {
            times[times.length - 1][1] = current + 1;
          } else {
            times.push([current, current + 1]);
          }
        }
        current += 1;
      }
      if (times.length > 0) {
        schedule.set(weekdays[j], times.map(time => {
          return (
            {
              startTime: time[0].toString().padStart(2, "0")+":00",
              endTime: time[1].toString().padStart(2, "0")+":00",
            }
          );
        }));
      }
    }
    setSchedule(Object.fromEntries(schedule));
  }, [selected]);

  const table = () => {
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      const div = document.elementFromPoint(x, y) as HTMLDivElement;

      if (div) {
        const [rowNum, colNum] = div.id.split('.').map(Number);

        setSelected(prev => {
          return prev.map((row, i) => {
            return row.map((value, j) => {
              if (i === rowNum && j === colNum) {
                if (value) {
                  setWeeklyHours(prev => prev - 1);
                } else {
                  setWeeklyHours(prev => prev + 1);
                }
                return !value;
              }
              else {
                return value;
              }
            });
          });
        });
        setCurrentDiv(div);
      }
    }

    const handleTouch = (e: React.TouchEvent<HTMLDivElement>) => {
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      const div = document.elementFromPoint(x, y) as HTMLDivElement;

      if (currentDiv !== div) {
        if (div) {
          const [rowNum, colNum] = div.id.split('.').map(Number);

          setSelected(prev => {
            return prev.map((row, i) => {
              return row.map((value, j) => {
                if (i === rowNum && j === colNum) {
                  if (value) {
                    setWeeklyHours(prev => prev - 1);
                  } else {
                    setWeeklyHours(prev => prev + 1);
                  }
                  return !value;
                }
                else {
                  return value;
                }
              });
            });
          });
        }
        setCurrentDiv(div);
      }
    }

    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
      handleTouch(e);
      setCurrentDiv(null);
    }

    const handleTouchBox = (e: React.MouseEvent<HTMLDivElement>, rowNum: number, colNum: number) => {
      if (currentDiv) return;

      if (e.type === "mousedown") {
        setSelected(prev => {
          return prev.map((row, i) => {
            return row.map((value, j) => {
              if (i === rowNum && j === colNum) {
                if (value) {
                  setWeeklyHours(prev => prev - 1);
                } else {
                  setWeeklyHours(prev => prev + 1);
                }
                return !value;
              }
              else {
                return value;
              }
            });
          });
        });
      } else if (e.type === "mouseenter") {
        if (mouseDown && !selected[rowNum][colNum]) {
          setSelected(prev => {
            return prev.map((row, i) => {
              return row.map((value, j) => {
                if (i === rowNum && j === colNum && mouseDown) {
                  if (value) {
                    setWeeklyHours(prev => prev - 1);
                  } else {
                    setWeeklyHours(prev => prev + 1);
                  }
                  return !value;
                }
                else {
                  return value;
                }
              });
            });
          });
        } else if (mouseDown && selected[rowNum][colNum]) {
          setSelected(prev => {
            return prev.map((row, i) => {
              return row.map((value, j) => {
                if (i === rowNum && j === colNum && mouseDown) {
                  if (value) {
                    setWeeklyHours(prev => prev - 1);
                  } else {
                    setWeeklyHours(prev => prev + 1);
                  }
                  return !value;
                }
                else {
                  return value;
                }
              });
            });
          });
        }
      }
    }

    return (
      [...Array(12)].map((_, rowNum) => {
        return (
          <React.Fragment key={rowNum}>
            <div key={rowNum} className="relative bottom-[-15px] flex justify-center items-center leading-[0px] text-[11px] text-[#9C9898] font-bold" >
              {rowNum + 10}
            </div>
            {
              [...Array(7)].map((_, colNum) => {
                return <div id={`${rowNum}.${colNum}`} key={rowNum * 12 + colNum} className={`touch-none min-h-[30px] outline outline-[1px] ${selected[rowNum][colNum] ? "bg-[#FFF2CC] outline-[#FFAE00] z-0" : "bg-[#FFFFFF] outline-[#D4D2D2]"}`}
                  onMouseUp={(e) => handleTouchBox(e, rowNum, colNum)}
                  onMouseDown={(e) => handleTouchBox(e, rowNum, colNum)}
                  onMouseEnter={(e) => handleTouchBox(e, rowNum, colNum)}
                  onMouseLeave={(e) => handleTouchBox(e, rowNum, colNum)}
                  onTouchStart={(e) => handleTouchStart(e)}
                  onTouchEnd={(e) => handleTouchEnd(e)}
                  onTouchMove={(e) => handleTouch(e)}
                />
              })
            }
          </React.Fragment>
        );
      })
    );
  }
  return (
    <div className="w-full select-none">
      <div className="grid grid-cols-[30px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] h-[30px] gap-[1px] p-[1px]">
        <div key={1} className="relative bottom-[-15px] flex justify-center items-center leading-[0px] text-[11px] text-[#9C9898] font-bold" >
          {9}
        </div>
        {
          ["월", "화", "수", "목", "금", "토", "일"].map((weekday) => {
            return (
              <div key={weekday} className="flex justify-center items-center bg-[#FFFFFF] leading-[0px] text-[14px] font-bold" >
                {weekday}
              </div>
            );
          })
        }
      </div>
      <div className="h-full grid grid-rows-13 grid-cols-[30px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] w-full h-full gap-[1px]">
        {table()}
      </div>
    </div>
  );
};

export default TimeTable;
