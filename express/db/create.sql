CREATE TABLE public."Events" (
  id SERIAL,
  type VARCHAR(255),
  value INTEGER,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  CONSTRAINT "Events_pkey" PRIMARY KEY(id)
)
WITH (oids = false);


ALTER TABLE public."Events"
  OWNER TO postgres;
