CREATE TABLE playlists (
    id character(22) PRIMARY KEY,
    name text,
    description text,
    updated timestamp without time zone,
    created timestamp without time zone,
    cover text,
    total_tracks text,
    tags text[],
    creator text,
    data_updated timestamp without time zone DEFAULT now(),
    tracks text[]
);
CREATE UNIQUE INDEX playlists_pkey ON playlists(id bpchar_ops);

CREATE TABLE jobs (
    target text PRIMARY KEY,
    type text,
    status smallint DEFAULT '0'::smallint,
    added timestamp without time zone DEFAULT now(),
    updated timestamp without time zone,
    source text
);
CREATE UNIQUE INDEX jobs_pkey ON jobs(target text_ops);

CREATE TABLE creators (
    id text PRIMARY KEY,
    name text,
    data_updated timestamp without time zone DEFAULT now()
);
CREATE UNIQUE INDEX creators_pkey ON creators(id text_ops);
