"use client";

import { Accordion, Container, Grid, Image, Title } from "@mantine/core";
import classes from "./FAQSection.module.css";
import faqs from "./data/faq.json";
import image from "./faq.svg";

const FAQSection = () => {
  return (
    <section className={classes.wrapper}>
      <Container size="lg">
        <Grid id="faq-grid" gutter={50}>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Image src={image.src} alt="FAQ" />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Title order={2} ta="left" className={classes.title}>
              Câu hỏi thường gặp
            </Title>

            <Accordion chevronPosition="right" defaultValue="reset-password" variant="separated">
              {faqs.map((faq, index) => {
                return (
                  <Accordion.Item key={index} className={classes.item} value={index.toString()}>
                    <Accordion.Control>{faq.question}</Accordion.Control>
                    <Accordion.Panel>{faq.answer}</Accordion.Panel>
                  </Accordion.Item>
                );
              })}
            </Accordion>
          </Grid.Col>
        </Grid>
      </Container>
    </section>
  );
};

export default FAQSection;
