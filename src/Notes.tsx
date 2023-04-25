import React, { useEffect, useState } from "react";

import { listNotes } from "./graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
} from "./graphql/mutations";
import { API, graphqlOperation } from "aws-amplify";
import { ListNotesQuery, Note } from "./API";
import { GraphQLResult, GraphQLQuery } from "@aws-amplify/api";
import {
  Button,
  Flex,
  Heading,
  View,
  Text,
  TextField,
} from "@aws-amplify/ui-react";

const Notes = () => {
  const [notes, setNotes] = useState<(Note | null)[]>([]); //

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = async () => {
    try {
      const apiData = (await API.graphql(
        graphqlOperation(listNotes)
      )) as GraphQLResult<ListNotesQuery>;

      const noteData = await API.graphql<GraphQLQuery<typeof listNotes>>(
        graphqlOperation(listNotes)
      );

      if (!apiData || !apiData.data || !apiData.data.listNotes) {
        return <p>loading</p>;
      }

      const notesData = apiData?.data?.listNotes?.items || [];

      console.log({ notesData });

      setNotes(notesData);
    } catch (error) {
      console.log(error);
    }
  };

  const createNote = async (event: any) => {
    event.preventDefault();
    const form = new FormData(event.target);
    const data = {
      name: form.get("name"),
      description: form.get("description"),
    };
    await API.graphql({
      query: createNoteMutation,
      variables: { input: data },
    });
    getNotes();
    event.target.reset();
  };

  const deleteNote = async ({ id }: { id: string }) => {
    const newNotes = notes.filter((note) => note?.id !== id);
    setNotes(newNotes);
    await API.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } },
    });
  };

  console.log({ notes });

  return (
    <>
      <View as="form" margin="3rem 0" onSubmit={createNote}>
        <Flex direction="row" justifyContent="center">
          <TextField
            name="name"
            placeholder="Note Name"
            label="Note Name"
            labelHidden
            variation="quiet"
            required
          />
          <TextField
            name="description"
            placeholder="Note Description"
            label="Note Description"
            labelHidden
            variation="quiet"
            required
          />
          <Button type="submit" variation="primary">
            Create Note
          </Button>
        </Flex>
      </View>

      <Heading level={4}>Current Notes</Heading>
      <View margin="1rem 0">
        {notes?.map((note) => (
          <Flex
            key={note?.id || note?.name}
            direction="row"
            alignItems="center"
          >
            {" "}
            <Text as="span">{note?.id}</Text>
            <Text as="strong" fontWeight={100}>
              {note?.name}
            </Text>
            <Text as="span">{note?.description}</Text>
            <Button
              variation="link"
              onClick={() => deleteNote({ id: note?.id as string })}
            >
              Delete note
            </Button>
          </Flex>
        ))}
      </View>
    </>
  );
};

export default Notes;
