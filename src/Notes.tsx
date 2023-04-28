import React, { useEffect, useState } from "react";

import { listNotes } from "./graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
  updateNote as updateNoteMutation,
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
  const initialValues = {
    id: "",
    name: "",
    description: "",
  };
  const [notes, setNotes] = useState<(Note | null)[]>([]); //
  const [btnLabel, setbtnLabel] = useState("Create Note");
  const [displayed, setDisplayed] = useState<string>("none");
  const [formData, setFormData] = useState(initialValues);

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = async () => {
    try {
      const { data } = (await API.graphql(
        graphqlOperation(listNotes)
      )) as GraphQLResult<ListNotesQuery>;
      /*
      const noteData = await API.graphql<GraphQLQuery<typeof listNotes>>(
        graphqlOperation(listNotes)
      );
      //*/

      if (!data || !data.listNotes) {
        return <p>loading</p>;
      }

      const notesData = data?.listNotes?.items || [];

      console.log({ notesData });

      setNotes(notesData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (event: any) => {
    if (formData?.id?.length) {
      updateNote(event);
    } else {
      createNote(event);
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

  const editNote = async ({
    id,
    name,
    description,
  }: {
    id: string;
    name: string;
    description: string;
  }) => {
    setFormData({ id, name, description });
    setbtnLabel("Update Note");
    setDisplayed("flex");
  };

  const updateNote = async (event: any) => {
    event.preventDefault();
    const form = new FormData(event.target);
    const data = {
      name: form.get("name"),
      description: form.get("description"),
      id: form.get("id"),
    };
    await API.graphql({
      query: updateNoteMutation,
      variables: { input: data },
    });
    getNotes();
    setbtnLabel("Create Note");
    setDisplayed("none");
    setFormData(initialValues);
    event.target.reset();
  };

  console.log({ notes });

  return (
    <>
      <View as="form" margin="3rem 0" onSubmit={handleSubmit}>
        <Flex direction="row" justifyContent="center">
          <TextField
            name="id"
            placeholder="Id note"
            label="Note Name"
            labelHidden
            variation="quiet"
            readOnly={true}
            display={displayed}
            defaultValue={formData.id}
          />
          <TextField
            name="name"
            placeholder="Note Name"
            label="Note Name"
            labelHidden
            variation="quiet"
            required
            defaultValue={formData.name}
          />
          <TextField
            name="description"
            placeholder="Note Description"
            label="Note Description"
            labelHidden
            variation="quiet"
            required
            defaultValue={formData.description}
          />
          <Button type="submit" variation="primary">
            {btnLabel}
          </Button>
        </Flex>
      </View>

      <Heading level={4}>Current Notes</Heading>
      <View margin="1rem 0">
        {notes?.map((note) => {
          return (
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
              <Button variation="link" onClick={() => editNote(note as any)}>
                Edit note
              </Button>
            </Flex>
          );
        })}
      </View>
    </>
  );
};

export default Notes;
