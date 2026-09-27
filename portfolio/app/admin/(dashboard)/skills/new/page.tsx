import { getSkillGroups } from "@/actions/skills";
import SkillForm from "@/components/admin/SkillForm";

export default async function NewSkillPage() {
  const groups = await getSkillGroups();
  return <SkillForm groups={groups} />;
}
