import { prisma } from '@/lib/prisma';
import { TranslatableEntity } from '@prisma/client';

export async function getTranslation(
  entityType: TranslatableEntity,
  entityId: string,
  fieldName: string,
  locale: string,
  defaultValue?: string
): Promise<string> {
  const translation = await prisma.i18n.findUnique({
    where: {
      entityType_entityId_locale_fieldName: {
        entityType,
        entityId,
        locale,
        fieldName,
      },
    },
  });

  return translation?.translation || defaultValue || '';
}

export async function getTranslations(
  entityType: TranslatableEntity,
  entityId: string,
  locale: string
): Promise<Record<string, string>> {
  const translations = await prisma.i18n.findMany({
    where: {
      entityType,
      entityId,
      locale,
    },
  });

  return translations.reduce((acc, t) => {
    acc[t.fieldName] = t.translation;
    return acc;
  }, {} as Record<string, string>);
}

export async function setTranslation(
  entityType: TranslatableEntity,
  entityId: string,
  fieldName: string,
  locale: string,
  translation: string
): Promise<void> {
  await prisma.i18n.upsert({
    where: {
      entityType_entityId_locale_fieldName: {
        entityType,
        entityId,
        locale,
        fieldName,
      },
    },
    update: {
      translation,
    },
    create: {
      entityType,
      entityId,
      fieldName,
      locale,
      translation,
    },
  });
}

export async function deleteTranslations(
  entityType: TranslatableEntity,
  entityId: string
): Promise<void> {
  await prisma.i18n.deleteMany({
    where: {
      entityType,
      entityId,
    },
  });
}